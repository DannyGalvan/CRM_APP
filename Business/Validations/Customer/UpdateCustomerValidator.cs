using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Customer
{
    public class UpdateCustomerValidator : AbstractValidator<CustomerRequest>
    {
        public UpdateCustomerValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El campo Id es requerido")
                .Must(HasValidId).WithMessage("El Id no es valido");
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("El campo Nombre es requerido")
                .Length(3,50).WithMessage("El Nombre debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.SecondName)
                .Must(x => HasValidOptionalString(x)).WithMessage("El Segundo Nombre debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.FirstLastName)
                .NotEmpty().WithMessage("El campo Primer Apellido es requerido")
                .Length(3, 50).WithMessage("El Primer Apellido debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.SecondLastName)
                .Must(x => HasValidOptionalString(x)).WithMessage("El Segundo Apellido debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.FirstPhone)
                .NotEmpty().WithMessage("El campo Teléfono es requerido")
                .MinimumLength(8).WithMessage("El Primer telefono debe tener minimos 8 caracteres")
                .MaximumLength(12).WithMessage("El segundo numero debe tener maximo 12 caracteres");
            RuleFor(x => x.SocialNetworks)
                .Must(x => HasValidOptionalString(x, 5,250)).WithMessage("Las Redes sociales deben tener minimo 5 caracteres y maximo 250");
            RuleFor(x => x.CreatedBy)
               .Null().WithMessage("El Usuario creador no puede ser modificado");
            RuleFor(x => x.UpdatedBy)
                .NotEmpty().WithMessage("El Usuario creador es requerido")
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
