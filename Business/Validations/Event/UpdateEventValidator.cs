using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Event
{
    public class UpdateEventValidator : AbstractValidator<EventRequest>
    {
        public UpdateEventValidator()
        {
            RuleFor(e => e.Id)
                .NotEmpty().WithMessage("El id es requerido")
                .Must(HasValidId).WithMessage("El id no es valido");
            RuleFor(e => e.Title)
                .NotEmpty().WithMessage("El titulo es requerido");
            RuleFor(e => e.Description)
                .NotEmpty().WithMessage("La descripcion es requerida");
            RuleFor(e => e.Start)
                .NotEmpty().WithMessage("La fecha de inicio no puede ser vacia");
            RuleFor(e => e.End)
                .NotEmpty().WithMessage("La fecha de finalización no pudede ser vacia");
            RuleFor(e => e.AllDay)
                .NotNull().WithMessage("El campo todo el día es requerido")
                .NotEmpty().WithMessage("El campo todo el día es requerido");
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
    }
}
