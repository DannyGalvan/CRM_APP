﻿using Business.Interfaces;
using Entities.Request;
using Entities.Configurations;
using Entities.Models;
using Entities.Response;
using FluentValidation.Results;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net;
using ValidationFailure = FluentValidation.Results.ValidationFailure;
using Entidades.Request;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using Humanizer;
using AutoMapper;
using Entities.Interfaces;
using FluentValidation;
using Lombok.NET;
using Microsoft.Extensions.Logging;

namespace Business.Services
{
    [AllArgsConstructor]
    public partial class AuthService : IAuthService
    {
        private readonly ICrmContext _bd;
        private readonly IOptions<AppSettings> _appSettings;
        private readonly ISendMail _mail;
        private readonly IMapper _mapper;
        private readonly IValidator<LoginRequest> _loginValidations;
        private readonly IValidator<ChangePasswordRequest> _changePasswordValidations;
        private readonly IValidator<ResetPasswordRequest> _resetPasswordValidator;
        private readonly IValidator<RecoveryPasswordRequest> _recoveryPasswordValidator;
        private readonly ILogger<AuthService> _logger;

        public Response<AuthResponse, List<ValidationFailure>> Auth(LoginRequest model)
        {
            Response<AuthResponse, List<ValidationFailure>> userResponse = new();
            try
            {
                ValidationResult results = _loginValidations.Validate(model);

                if (!results.IsValid)
                {
                    userResponse.Success = false;
                    userResponse.Message = "Usuario y/o contraseña invalidos";
                    userResponse.Data = null;
                    userResponse.Errors = results.Errors;

                    return userResponse;
                }

                string collectionName = nameof(User).Pluralize();

                IMongoCollection<User> users = _bd.Database.GetCollection<User>(collectionName);

                User? oUser = users.Find(u => u.UserName.Equals(model.UserName, StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();

                if (oUser == null)
                {
                    userResponse.Success = false;
                    userResponse.Message = "Usuario y/o contraseña invalidos";
                    userResponse.Data = null;
                    userResponse.Errors = results.Errors;

                    return userResponse;
                }

                if (!BC.BCrypt.Verify(model.Password, oUser.Password))
                {
                    userResponse.Success = false;
                    userResponse.Message = "Usuario y/o contraseña invalidos";
                    userResponse.Data = null;
                    userResponse.Errors = results.Errors;

                    return userResponse;
                }

                var authorizations = GetAuthorizations(oUser);

                oUser.UserOperations = authorizations.userOperations;

                string jwt = GetToken(oUser);                

                AuthResponse auth = new()
                {
                    Email = oUser.Email,
                    UserId = oUser.Id.ToString(),
                    Name = oUser.Name,
                    UserName = oUser.UserName,
                    Token = jwt,
                    Operations = authorizations.authorizations,
                    Redirect = oUser.Reset!.Value,
                };

                userResponse.Success = true;
                userResponse.Message = "Inicio de sesión exitosa";
                userResponse.Data = auth;
                userResponse.Errors = null;

                return userResponse;
            }
            catch (Exception ex)
            {
                userResponse.Success = false;
                userResponse.Message = "Upss hubo un error";
                userResponse.Data = null;
                userResponse.Errors = [new("Exception", ex.Message)];

                _logger.LogError(ex, "Error al autenticar usuario path: /api/Auth");

                return userResponse;
            }
        }

        public Response<string, List<ValidationFailure>> ChangePassword(ChangePasswordRequest model)
        {

            Response<string, List<ValidationFailure>> response = new();

            try
            {
                ValidationResult results = _changePasswordValidations.Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Error al hacer la solicitud";
                    response.Data = "";
                    response.Errors = results.Errors;

                    return response;
                }

                string collectionName = nameof(User).Pluralize();

                IMongoCollection<User> users = _bd.Database.GetCollection<User>(collectionName);

                User? oUser = users.Find(u => u.RecoveryToken == model.Token).FirstOrDefault();

                if (oUser == null || model.Password != model.ConfirmPassword)
                {
                    response.Success = false;
                    response.Message = "Las Contraseñas no coinciden";
                    response.Data = "";
                    response.Errors = results.Errors;
                    return response;
                }

                if (BC.BCrypt.Verify(model.Password, oUser.Password))
                {
                    response.Success = false;
                    response.Message = "La nueva contraseña debe ser distinta a la contraseña anterior";
                    response.Data = "";
                    response.Errors = results.Errors;
                    return response;
                }

                string encrypt = BC.BCrypt.HashPassword(model.Password);

                var saveChanges = users.UpdateOne(u => u.Id == oUser.Id, Builders<User>.Update.Set(u => u.Password, encrypt).Set(u => u.RecoveryToken, ""));

                if (saveChanges.ModifiedCount == 0)
                {
                    response.Success = false;
                    response.Message = "Hubo un Error en el Cambio de Contraseña";
                    response.Data = "";
                    response.Errors = results.Errors;
                    return response;
                }

                response.Success = true;
                response.Message = "Cambio de Contraseña Exitoso";
                response.Data = $"tu nueva contraseña es: {model.Password}";
                response.Errors = results.Errors;


                return response;
            }
            catch (Exception ex)
            {              
                response.Success = false;
                response.Message = $"Error al hacer la solicitud {ex.Message}";
                response.Data = "";
                response.Errors = [new("Exception", ex.Message)];

                _logger.LogError(ex, "Error al cambiar la contraseña path: /api/Auth/ChangePassword");

                return response;
            }
        }

        public Response<string, List<ValidationFailure>> ResetPassword(ResetPasswordRequest model)
        {

            Response<string, List<ValidationFailure>> response = new();

            try
            {
                ValidationResult results = _resetPasswordValidator.Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Error al hacer la solicitud";
                    response.Data = "";
                    response.Errors = results.Errors;

                    return response;
                }

                string collectionName = nameof(User).Pluralize();

                IMongoCollection<User> users = _bd.Database.GetCollection<User>(collectionName);

                ObjectId id = ObjectId.Parse(model.IdUser);

                string encrypt = BC.BCrypt.HashPassword(model.Password);

                var saveChanges = users.UpdateOne(u => u.Id == id, Builders<User>.Update.Set(u => u.Password, encrypt).Set(u => u.RecoveryToken, "").Set(u => u.Reset, false));

                if (saveChanges.MatchedCount == 0)
                {
                    response.Success = false;
                    response.Message = "Hubo un error al reestablecer la Contraseña";
                    response.Data = "";
                    response.Errors = results.Errors;
                    return response;
                }

                response.Success = true;
                response.Message = "Cambio de Contraseña Exitoso";
                response.Data = $"tu nueva contraseña es: {model.Password}";
                response.Errors = results.Errors;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error al hacer la solicitud {ex.Message}";
                response.Data = "";
                response.Errors = [new("Exception", ex.Message)];

                _logger.LogError(ex, "Error al reestablecer la contraseña path: /api/Auth/ResetPassword");
            }

            return response;
        }

        public Response<string> ValidateToken(string token)
        {

            Response<string> response = new();

            try
            {
                string collectionName = typeof(User).Name.Pluralize();

                IMongoCollection<User> users = _bd.Database.GetCollection<User>(collectionName);

                var oUser = users.Find(u => u.RecoveryToken == token).FirstOrDefault();

                if (oUser == null)
                {
                    response.Success = false;
                    response.Message = "Su Token ya ha Expirado";
                    response.Data = token;
                    return response;
                }

                DateTime? dateToken = !string.IsNullOrEmpty(oUser.DateToken)
                                         ? DateTime.ParseExact(oUser.DateToken, "yyyy-MM-dd mm:ss:f", CultureInfo.InvariantCulture)
                                         : null;

                var currentDate = DateTime.Now;

                if (dateToken != null && currentDate.CompareTo(dateToken) >= 0)
                {
                    response.Success = false;
                    response.Message = "Tu Token ya ha Expirado";
                    response.Data = token;
                    return response;
                }

                response.Success = true;
                response.Message = "Token Válido";
                response.Data = token;

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error al verificar token";
                response.Data = token;

                _logger.LogError(ex, "Error al verificar token path: api/Auth/Token/[token]");

                return response;
            }
        }

        public Response<string, List<ValidationFailure>> RecoveryPassword(RecoveryPasswordRequest model)
        {
            Response<string, List<ValidationFailure>> response = new();

            try
            {
                ValidationResult results = _recoveryPasswordValidator.Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Error al hacer la solicitud";
                    response.Data = "";
                    response.Errors = results.Errors;

                    return response;
                }

                string collectionName = nameof(User).Pluralize();

                IMongoCollection<User> users = _bd.Database.GetCollection<User>(collectionName);

                User oUser = users.Find(u => u.Email == model.Email).FirstOrDefault();

                string token = BC.BCrypt.HashPassword(Guid.NewGuid().ToString());

                oUser.RecoveryToken = token;
                oUser.Reset = true;
                oUser.DateToken = DateTime.Now.ToString("yyyy-MM-dd mm:ss:f");

                var saveChanges = users.UpdateOne(u => u.Id == oUser.Id, Builders<User>.Update.Set(u => u.RecoveryToken, token).Set(u => u.Reset, true).Set(u => u.DateToken, oUser.DateToken));

                if (saveChanges.ModifiedCount == 0)
                {
                    response.Success = false;
                    response.Message = "Error al intentar recuperar contraseña";
                    response.Data = "";
                    response.Errors = results.Errors;

                    return response;
                }

                const string affair = "Solicitud De Cambio de Contraseña";
                var link = $"{_appSettings.Value.UrlClient}/RecoveryPassword?token={token}";
                var messageMail =
                    $"<h3>Ingese al siguiente link para cambiar su contraseña!</h3></br><a href='{link}'>Cambiar Contraseña</a>";

                var sendMail = _mail.Send(model.Email, affair, messageMail);

                if (!sendMail)
                {
                    response.Success = false;
                    response.Message = "Error al Enviar Correo";
                    response.Data = "";
                    response.Errors = results.Errors;

                    return response;
                }

                response.Success = true;
                response.Message = "Correo Enviado Con Exito";
                response.Data = link;
                response.Errors = results.Errors;

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error al hacer la solicitud {ex.Message}";
                response.Data = "";
                response.Errors = [new("Exception", ex.Message)];

                _logger.LogError(ex, "Error al recuperar contraseña path: /api/Auth/RecoveryPassword");

                return response;
            }
        }

        private string GetToken(User user)
        {
            try
            {
                AppSettings appSettings = _appSettings.Value;
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(appSettings.Secret);
                var claims = new List<Claim>()
                             {
                                 new (ClaimTypes.NameIdentifier, user.Id.ToString()),
                                 new (ClaimTypes.Email, user.Email),
                                 new (ClaimTypes.Name, user.UserName),
                                 new (ClaimTypes.Hash, Guid.NewGuid().ToString()),
                             };

                if (user.UserOperations.Count != 0)
                {
                    claims.AddRange(user.UserOperations.Select(item => new Claim(ClaimTypes.AuthorizationDecision, item.OperationId.ToString())));
                }

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims.ToArray()),
                    NotBefore = DateTime.UtcNow.AddMinutes(appSettings.NotBefore),
                    Expires = DateTime.UtcNow.AddHours(appSettings.TokenExpirationHrs),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);

                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "Error al Generar el jwt");

                return string.Empty;
            }
        }

        private AuthorizationsResponse GetAuthorizations(User user)
        {
            string operationsCollection = nameof(UserOperation).Pluralize();
            IMongoCollection<UserOperation> userOperationsCollection = _bd.Database.GetCollection<UserOperation>(operationsCollection);

            var aggregate = userOperationsCollection.Aggregate();
            var relatedCollectionName = nameof(Operation).Pluralize();

            var lookupStage = new BsonDocument("$lookup", new BsonDocument
            {
                { "from", relatedCollectionName },
                { "localField", "OperationId"},
                { "foreignField", "_id" },
                { "as", "Operation" }
            });
            aggregate = aggregate.AppendStage<UserOperation>(lookupStage);

            var unwindStage = new BsonDocument("$unwind", new BsonDocument
            {
                { "path", "$Operation" },
                { "preserveNullAndEmptyArrays", true }
            });

            aggregate = aggregate.AppendStage<UserOperation>(unwindStage);
            List<UserOperation> userOperations = aggregate.Match(o => o.UserId == user.Id).ToList();
            var agroupedByModule = userOperations.GroupBy(o => o.Operation!.ModuleId).ToList();

            List<Authorizations> authorizations = new();
            foreach (var item in agroupedByModule)
            {
                var module = item.FirstOrDefault()!.Operation!.ModuleId;
                string moduleCollectionName = nameof(Module).Pluralize();
                IMongoCollection<Module> moduleCollection = _bd.Database.GetCollection<Module>(moduleCollectionName);
                var oModule = moduleCollection.Find(m => m.Id == module).FirstOrDefault();
                List<Operation> operations = item.Select(op => op.Operation!).ToList();

                Authorizations authorization = new()
                {
                    Module = _mapper.Map<ModuleResponse>(oModule),
                    Operations = _mapper.Map<List<Operation>, List<OperationResponse>>(operations)
                };

                authorizations.Add(authorization);
            }
            return new AuthorizationsResponse() {
                authorizations = authorizations,
                userOperations = userOperations
            };
        }
    }
}

