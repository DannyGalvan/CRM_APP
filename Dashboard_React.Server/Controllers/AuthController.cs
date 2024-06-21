using Business.Interfaces;
using Entidades.Request;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using Lombok.NET;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;

namespace CardReader.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [AllArgsConstructor]
    public partial class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        [AllowAnonymous]
        [HttpPost]
        public ActionResult Login(LoginRequest model)
        {
            var response = _authService.Auth(model);

            if (response.Success)
            {
                Response<AuthResponse> authResponse = new()
                {
                    Data = response.Data,
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(authResponse);
            }
            else { 

                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        [AllowAnonymous]
        [HttpGet("{token}")]
        public ActionResult GetToken(string token)
        {
            Response<string> response = _authService.ValidateToken(token);

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPut("ChangePassword")]
        public ActionResult<Response<string>> ChangePassword(ChangePasswordRequest model)
        {
            Response<string, List<ValidationFailure>> response = _authService.ChangePassword(model);

            if (response.Success)
            {
                Response<string> changePasswordResponse = new()
                {
                    Data = response.Data,
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(changePasswordResponse);

            } else
            {
                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        [Authorize]
        [HttpPost("ResetPassword")]
        public ActionResult PostResetPassword([FromBody] ResetPasswordRequest model) 
        {
            model.IdUser = GetUserId().ToString();
            Response<string, List<ValidationFailure>> response = _authService.ResetPassword(model);

            if (response.Success)
            {
                Response<string> resetPasswordResponse = new()
                {
                    Data = response.Data,
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(resetPasswordResponse);

            }
            else
            {
                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        [AllowAnonymous]
        [HttpPost("RecoveryPassword")]
        public ActionResult PostRecoveryPassword([FromBody] RecoveryPasswordRequest model)
        {
            Response<string, List<ValidationFailure>> response = _authService.RecoveryPassword(model);

            if (response.Success)
            {
                Response<string> recoveryPasswordResponse = new()
                {
                    Data = response.Data,
                    Success = response.Success,
                    Message = response.Message
                };

                return Ok(recoveryPasswordResponse);

            }
            else
            {
                Response<List<ValidationFailure>> errorResponse = new()
                {
                    Data = response.Errors,
                    Success = response.Success,
                    Message = response.Message
                };

                return BadRequest(errorResponse);
            }
        }

        private ObjectId GetUserId()
        {
            Claim? claimId = User.FindFirst(ClaimTypes.NameIdentifier);

            return claimId != null ? ObjectId.Parse(claimId.Value) : ObjectId.Empty;
        }
    }
}
