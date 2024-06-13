using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Catalog
{
    public class CreateCatalogValidator : AbstractValidator<CatalogueRequest>
    {
        public CreateCatalogValidator()
        {
            RuleFor(x => x.Name).
                NotEmpty().WithMessage("El Nombre es requerido");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("La descripcion es requerida");
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
