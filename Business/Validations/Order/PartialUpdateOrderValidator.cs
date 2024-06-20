using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Order
{
    public class PartialupdateOrderValidator : AbstractValidator<OrderRequest>
    {
        public PartialupdateOrderValidator()
        {
            RuleFor(x => x.Id)
                 .NotEmpty().WithMessage("Id es requerido")
                 .NotNull().WithMessage("Id no puede ser nulo")
                 .Must(HasValidId).WithMessage("El Id no es valido");

            RuleFor(x => x.UpdatedBy)
                .NotEmpty().WithMessage("El usuario actualizador es requerido")
                .NotNull().WithMessage("El usuario actualizador no puede ser nulo");

            RuleFor(x => x.CreatedBy)
                .Null().WithMessage("El usuario creador no puede ser actualizado");
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
    }
}
