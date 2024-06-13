
using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Collection
{
    public class CreateCollectionValidator : AbstractValidator<CollectionRequest>
    {
        public CreateCollectionValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("El nombre es requerido")
                .MaximumLength(100)
                .WithMessage("El nombre no puede exceder de 100 caracteres")
                .MinimumLength(5)
                .WithMessage("El nombre debe tener minimo 5 caracteres");
            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("La descripción es requerida")
                .MaximumLength(500)
                .WithMessage("La descripción no puede exceder de 500 caracteres")
                .MinimumLength(5)
                .WithMessage("La descripción debe tener minimo 5 caracteres");
            RuleFor(x => x.NameView)
                .NotEmpty()
                .WithMessage("La vista es requerida")
                .MaximumLength(100)
                .WithMessage("La vista no puede exceder de 100 caracteres")
                .MinimumLength(5)
                .WithMessage("La vista debe tener minimo 5 caracteres");
            RuleFor(x => x.IsReadOnly)
                .NotNull()
                .WithMessage("El campo de solo lectura es requerido");
            RuleFor(x => x.IsVisible)
                .NotNull()
                .WithMessage("El campo de visibilidad es requerido");
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
