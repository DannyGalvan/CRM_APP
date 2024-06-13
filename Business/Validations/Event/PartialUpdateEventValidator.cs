using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Event
{
    public class PartialUpdateEventValidator : AbstractValidator<EventRequest>
    {
        public PartialUpdateEventValidator()
        {
            RuleFor(e => e.Id)
                .NotEmpty().WithMessage("El id es requerido")
                .NotNull().WithMessage("El id no puede ser nulo")
                .Must(HasValidId).WithMessage("El id no es valido");
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
