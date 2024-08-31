﻿using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Pilot
{
    public class CreatePilotValidator : AbstractValidator<PilotRequest>
    {
        public CreatePilotValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El Nombre del piloto es requerido")
                .Length(3, 50).WithMessage("El Nombre del piloto debe tener entre 3 y 50 caracteres");
            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("El Apellido del piloto es requerido")
                .Length(3, 50).WithMessage("El Apellido del piloto debe tener entre 3 y 50 caracteres");
            RuleFor(x => x.License)
                .NotEmpty().WithMessage("La Licencia del piloto es requerida")
                .Length(5, 50).WithMessage("La Licencia del piloto debe tener entre 5 y 50 caracteres");
            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("El Teléfono del piloto es requerido")
                .Length(8, 12).WithMessage("El Teléfono del piloto debe tener 8 caracteres minimo maximo 12");
            RuleFor(x => x.Email)
                .Must(HasValidEmail).WithMessage("El Correo del piloto no es valido");
            RuleFor(x => x.CreatedBy)
                .NotNull().WithMessage("El Usuario creador no puede ser nulo")
                .NotEmpty().WithMessage("El Usuario creador no puede ser vacio")
                .Must(HasValidId).WithMessage("El Usuario creador no es valido");
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }

        private bool HasValidEmail(string? email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return true;
            }

            return new System.Net.Mail.MailAddress(email).Address == email;
        }
    }
}