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
                .NotEmpty().WithMessage("El campo Segundo Nombre es requerido")
                .Length(3, 50).WithMessage("El Segundo Nombre debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.FirstLastName)
                .NotEmpty().WithMessage("El campo Primer Apellido es requerido")
                .Length(3, 50).WithMessage("El Primer Apellido debe tener mas de 3 caracteres y menos de 50"); ;
            RuleFor(x => x.SecondLastName)
                .NotEmpty().WithMessage("El campo Segundo Apellido es requerido")
                .Length(3, 50).WithMessage("El Segundo Apellido debe tener mas de 3 caracteres y menos de 50"); ;
            RuleFor(x => x.FirstPhone)
                .NotEmpty().WithMessage("El campo Teléfono es requerido");
            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("El campo Dirección es requerido");
            RuleFor(x => x.DepartmentId)
                .NotEmpty().WithMessage("El campo Departamento es requerido")
                .Must(HasValidId).WithMessage("El Departamento no tiene un id valido");
            RuleFor(x => x.MunicipalityId)
                .NotEmpty().WithMessage("El campo Municipio es requerido")
                .Must(HasValidId).WithMessage("El Municipio no tiene una id valido");
            RuleFor(x => x.ZoneId)
                .NotEmpty().WithMessage("El campo Zona es requerido")
                .Must(HasValidId).WithMessage("La Zona no tiene un id valido");
            RuleFor(x => x.Colony_Condominium)
                .NotEmpty().WithMessage("El campo Colonia/Condominio es requerido");
            RuleFor(x => x.CreatedBy)
               .NotNull().WithMessage("El Usuario creador no puede ser nulo")
               .NotEmpty().WithMessage("El Usuario creador no puede ser vacio")
               .Must(HasValidId).WithMessage("El Usuario creador no es valido");
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
    }
}
