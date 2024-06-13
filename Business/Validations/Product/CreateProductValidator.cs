using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Product
{
    public class CreateProductValidator : AbstractValidator<ProductRequest>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El Nombre del producto es requerido")
                .Length(3,50).WithMessage("El Nombre del producto debe tener entre 3 y 50 caracteres");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("La Descripción del producto es requerida")
                .Length(5,250).WithMessage("La Descripción del producto debe tener entre 5 y 250 caracteres");
            RuleFor(x => x.FamilyId)
                .NotEmpty().WithMessage("La Familia del producto es requerida")
                .Must(HasValidId).WithMessage("La Familia no tiene un id valido");
            RuleFor(x => x.Cost)
                .NotEmpty().WithMessage("El Costo del producto es requerido")
                .GreaterThanOrEqualTo(0.1M).WithMessage("El Costo del producto debe ser mayor a 0");
            RuleFor(x => x.SalePrice)
                .NotEmpty().WithMessage("El Precio del producto es requerido")
                .GreaterThanOrEqualTo(0.1M).WithMessage("El Precio debe ser mayor a 0");
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
