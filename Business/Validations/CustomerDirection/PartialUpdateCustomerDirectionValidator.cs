using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.CustomerDirection
{
    public class PartialUpdateCustomerDirectionValidator : AbstractValidator<CustomerDirectionRequest>
    {
        public PartialUpdateCustomerDirectionValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El campo Id es requerido")
                .Must(HasValidId).WithMessage("El Id no es valido");
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
