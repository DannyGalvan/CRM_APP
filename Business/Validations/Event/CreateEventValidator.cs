using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Event
{
    public class CreateEventValidator : AbstractValidator<EventRequest>
    {
        public CreateEventValidator()
        {
            RuleFor(e => e.Title)
                .NotEmpty().WithMessage("El titulo es requerido");
            RuleFor(e => e.Description)
                .NotEmpty().WithMessage("La descripcion es requerida");
            RuleFor(e => e.Start)
                .NotEmpty().WithMessage("La fecha de inicio no puede ser vacia");
            RuleFor(e => e.Start)
                .NotEmpty().WithMessage("La fecha de finalización no pudede ser vacia");
            RuleFor(e => e.AllDay)
                .NotNull().WithMessage("El campo todo el día es requerido")
                .NotEmpty().WithMessage("El campo todo el día es requerido");
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
