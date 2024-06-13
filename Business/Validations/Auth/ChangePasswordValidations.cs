using Entities.Request;
using FluentValidation;

namespace Business.Validations.Auth
{
    public class ChangePasswordValidations : AbstractValidator<ChangePasswordRequest>
    {
        public ChangePasswordValidations()
        {
            RuleFor(c => c.Token)
                .NotEmpty()
                .WithMessage("El token es obligatorio");
            RuleFor(c => c.ConfirmPassword)
                .NotEmpty()
                .WithMessage("La confirmacion es obligatoria")
                .Equal(c => c.Password)
                .WithMessage("Las contraseñas no coinciden");
            RuleFor(c => c.Password)
                .NotEmpty()
                .WithMessage("la contraseña es obligatoria");
        }
    }
}
