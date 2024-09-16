using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Customer
{
    public class CreateCustomerValidator : AbstractValidator<CustomerRequest>
    {
        public CreateCustomerValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("El campo Nombre es requerido")
                .Length(3, 50).WithMessage("El Nombre debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.SecondName)
                .Must(x => HasValidOptionalString(x))
                .WithMessage("El Segundo Nombre debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.FirstLastName)
                .NotEmpty().WithMessage("El campo Primer Apellido es requerido")
                .Length(3, 50).WithMessage("El Primer Apellido debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.SecondLastName)
                .Must(x => HasValidOptionalString(x))
                .WithMessage("El Segundo Apellido debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.FirstPhone)
                .NotEmpty().WithMessage("El campo Teléfono es requerido")
                .MinimumLength(8).WithMessage("El Primer telefono debe tener minimos 8 caracteres")
                .MaximumLength(12).WithMessage("El primer numero debe tener maximo 12 caracteres");
            RuleFor(x => x.SocialNetworks)
                .Must( x => HasValidOptionalString(x,10,250))
                .WithMessage("Las redes sociales deben tener minimo 10 y maximo 250 caracteres");
            RuleFor(x => x.CreatedBy)
               .NotNull().WithMessage("El Usuario creador no puede ser nulo")
               .NotEmpty().WithMessage("El Usuario creador no puede ser vacio")
               .Must(HasValidId).WithMessage("El Usuario creador no es valido");
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }

        private bool HasValidOptionalString(string? data, int? min = 3, int? max = 50)
        {
            if (string.IsNullOrEmpty(data))
            {
                return true;
            }

            int actualMin = min ?? 3;
            int actualMax = max ?? 50;

            return data.Length >= actualMin && data.Length <= actualMax;
        }
    }
}
