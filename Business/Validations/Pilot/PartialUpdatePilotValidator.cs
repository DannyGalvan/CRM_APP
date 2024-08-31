using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Pilot
{
    public class PartialUpdatePilotValidator : AbstractValidator<PilotRequest>
    {
        public PartialUpdatePilotValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del producto es requerido")
                .Must(HasValidId).WithMessage("El Id no tiene un formato valido");
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
