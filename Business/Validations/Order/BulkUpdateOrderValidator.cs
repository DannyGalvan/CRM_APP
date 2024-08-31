using Entities.Request;
using FluentValidation;

namespace Business.Validations.Order
{
    public class BulkUpdateOrderValidator : AbstractValidator<BulkUpdateOrderRequest>
    {
        public BulkUpdateOrderValidator()
        {
            RuleFor(x => x.Orders).NotEmpty().WithMessage("Las ordenes son requeridas");
            RuleForEach(x => x.Orders).SetValidator(new PartialupdateOrderValidator());
        }
    }
}
