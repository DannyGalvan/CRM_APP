using Business.Validations.Auth;
using Business.Interfaces;
using Entities.Context;
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

namespace Business.Services
{
    public class AuthService(IOptions<AppSettings> appSettings, CRMContext bd, ISendMail mail, IMapper mapper) : IAuthService
    {
        private readonly CRMContext _bd = bd;
        private readonly AppSettings _appSettings = appSettings.Value;
        private readonly ISendMail _mail = mail;
        private readonly IMapper _mapper = mapper;

        public Response<AuthResponse, List<ValidationFailure>> Auth(LoginRequest model)
        {
            Response<AuthResponse, List<ValidationFailure>> userResponse = new();
            try
            {
                var validator = new LoginValidations(_bd);

                ValidationResult results = validator.Validate(model);

                if (!results.IsValid)
                {
                    userResponse.Success = false;
                    userResponse.Message = "Usuario y/o contraseña invalidos";
                    userResponse.Data = null;
                    userResponse.Errors = results.Errors;

                    return userResponse;
                }

                string collectionName = typeof(User).Name.Pluralize();

                IMongoCollection<User> Users = _bd.Database.GetCollection<User>(collectionName);

                User? oUser = Users.Find(u => u.UserName == model.UserName && u.Active == true).FirstOrDefault();

                if (oUser == null)
                {
                    userResponse.Success = false;
                    userResponse.Message = "Usuario y/o Contraseña invalidos";
                    userResponse.Data = null;
                    userResponse.Errors = results.Errors;

                    return userResponse;
                }

                if (!BC.BCrypt.Verify(model.Password, oUser.Password))
                {
                    userResponse.Success = false;
                    userResponse.Message = "Usuario y/o Contraseña invalidos";
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
                userResponse.Message = "Inicio de sesion exitosa";
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

                return userResponse;

            }
        }

        public Response<string, List<ValidationFailure>> ChangePassword(ChangePasswordRequest model)
        {

            Response<string, List<ValidationFailure>> response = new();

            var validator = new ChangePasswordValidations();
            ValidationResult results = validator.Validate(model);

            if (!results.IsValid)
            {
                response.Success = false;
                response.Message = "Error al hacer la solicitud";
                response.Data = "";
                response.Errors = results.Errors;

                return response;
            }

            string collectionName = typeof(User).Name.Pluralize();

            IMongoCollection<User> Users = _bd.Database.GetCollection<User>(collectionName);

            User? oUser = Users.Find(u => u.RecoveryToken == model.Token).FirstOrDefault();

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

            var saveChanges = Users.UpdateOne(u => u.Id == oUser.Id, Builders<User>.Update.Set(u => u.Password, encrypt).Set(u => u.RecoveryToken, ""));

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

        public Response<string, List<ValidationFailure>> ResetPassword(ResetPasswordRequest model)
        {

            Response<string, List<ValidationFailure>> response = new();

            try
            {
                var validator = new ResetPasswordValidations(_bd);
                ValidationResult results = validator.Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Error al hacer la solicitud";
                    response.Data = "";
                    response.Errors = results.Errors;

                    return response;
                }

                string collectionName = typeof(User).Name.Pluralize();

                IMongoCollection<User> Users = _bd.Database.GetCollection<User>(collectionName);

                User oUser = Users.Find(u => u.Id == model.IdUser!.Value).FirstOrDefault();

                string encrypt = BC.BCrypt.HashPassword(model.Password);

                var saveChanges = Users.UpdateOne(u => u.Id == model.IdUser, Builders<User>.Update.Set(u => u.Password, encrypt).Set(u => u.RecoveryToken, "").Set(u => u.Reset, false));

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
            }

            return response;
        }

        public Response<string> ValidateToken(string token)
        {

            Response<string> response = new();

            string collectionName = typeof(User).Name.Pluralize();

            IMongoCollection<User> Users = _bd.Database.GetCollection<User>(collectionName);

            var oUser = Users.Find(u => u.RecoveryToken == token).FirstOrDefault();

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

        public Response<string, List<ValidationFailure>> RecoveryPassword(RecoveryPasswordRequest model)
        {
            Response<string, List<ValidationFailure>> response = new();

            var validator = new RecoveryPasswordValidations(_bd);
            ValidationResult results = validator.Validate(model);

            if (!results.IsValid)
            {
                response.Success = false;
                response.Message = "Error al hacer la solicitud";
                response.Data = "";
                response.Errors = results.Errors;

                return response;
            }

            string collectionName = typeof(User).Name.Pluralize();

            IMongoCollection<User> Users = _bd.Database.GetCollection<User>(collectionName);

            User oUser = Users.Find(u => u.Email == model.Email).FirstOrDefault();

            string token = BC.BCrypt.HashPassword(Guid.NewGuid().ToString());

            oUser.RecoveryToken = token;
            oUser.Reset = true;
            oUser.DateToken = DateTime.Now.ToString("yyyy-MM-dd mm:ss:f");

            var saveChanges = Users.UpdateOne(u => u.Id == oUser.Id, Builders<User>.Update.Set(u => u.RecoveryToken, token).Set(u => u.Reset, true).Set(u => u.DateToken, oUser.DateToken));

            if (saveChanges.ModifiedCount == 0)
            {
                response.Success = false;
                response.Message = "Error al intentar recuperar contraseña";
                response.Data = "";
                response.Errors = results.Errors;

                return response;
            }

            const string affair = "Solicitud De Cambio de Contraseña";
            var link = $"{_appSettings.UrlClient}/RecoveryPassword?token={token}";
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

        private string GetToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var claims = new List<Claim>()
                             {
                                 new (ClaimTypes.NameIdentifier, user.Id.ToString()),
                                 new (ClaimTypes.Email, user.Email),
                                 new (ClaimTypes.Name, user.UserName),
                                 new (ClaimTypes.Hash, Guid.NewGuid().ToString()),
                             };

            if (user != null && user.UserOperations.Count != 0)
            {
                claims.AddRange(user.UserOperations.Select(item => new Claim(ClaimTypes.Role, item.OperationId.ToString())));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims.ToArray()),
                NotBefore = DateTime.UtcNow.AddMinutes(_appSettings.NotBefore),
                Expires = DateTime.UtcNow.AddHours(_appSettings.TokenExpirationHrs),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private AuthorizationsResponse GetAuthorizations(User user)
        {
            string operationsCollection = typeof(UserOperation).Name.Pluralize();
            IMongoCollection<UserOperation> UserOperations = _bd.Database.GetCollection<UserOperation>(operationsCollection);

            var aggregate = UserOperations.Aggregate();
            var relatedCollectionName = typeof(Operation).Name.Pluralize();

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
            var agrupedByModule = userOperations.GroupBy(o => o.Operation!.ModuleId).ToList();

            List<Authorizations> authorizations = new();
            foreach (var item in agrupedByModule)
            {
                var module = item.FirstOrDefault()!.Operation!.ModuleId;
                string moduleCollection = typeof(Module).Name.Pluralize();
                IMongoCollection<Module> Module = _bd.Database.GetCollection<Module>(moduleCollection);
                var oModule = Module.Find(m => m.Id == module).FirstOrDefault();
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

