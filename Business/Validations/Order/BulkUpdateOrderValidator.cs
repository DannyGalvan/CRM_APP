using Entities.Interfaces;
using Entities.Request;
using FluentValidation;

namespace Business.Validations.Order
{
    public class BulkUpdateOrderValidator : AbstractValidator<BulkUpdateOrderRequest>
    {
        IMongoContext _mongo;
        public BulkUpdateOrderValidator(IMongoContext mongo)
        {
            _mongo = mongo;

            RuleFor(x => x.Orders).NotEmpty().WithMessage("Las ordenes son requeridas");
            RuleForEach(x => x.Orders).SetValidator(new PartialupdateOrderValidator(_mongo));
        }
    }
}
