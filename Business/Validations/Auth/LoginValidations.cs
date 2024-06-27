﻿using Entities.Request;
using FluentValidation;

namespace Business.Validations.Auth
{
    public class LoginValidations : AbstractValidator<LoginRequest>
    {
        public LoginValidations()
        {
            RuleFor(l => l.Password)
                .NotEmpty()
                .OverridePropertyName("Password")
                .WithMessage("Usuario y/o contraseña invalidos")
                .MinimumLength(8).WithMessage("La contraseña debe contener al menos 8 caracteres")
                .Matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,25}$")
                .WithMessage("La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial, y tener entre 8 y 25 caracteres");

            RuleFor(l => l.UserName)
                .NotEmpty()
                .OverridePropertyName("Password")
                .WithMessage("Usuario y/o contraseña invalidos");
        }
    }
}
