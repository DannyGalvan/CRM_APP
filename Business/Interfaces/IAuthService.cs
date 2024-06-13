using Entidades.Request;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;

namespace Business.Interfaces
{
    public interface IAuthService
    {
        public Response<AuthResponse, List<ValidationFailure>> Auth(LoginRequest model);
        public Response<string> ValidateToken(string token);
        public Response<string, List<ValidationFailure>> ChangePassword(ChangePasswordRequest model);
        public Response<string, List<ValidationFailure>> ResetPassword(ResetPasswordRequest model);
        public Response<string, List<ValidationFailure>> RecoveryPassword(RecoveryPasswordRequest model);
    }
}
