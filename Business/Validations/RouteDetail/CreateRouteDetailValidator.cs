using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.RouteDetail
{
    public class CreateRouteDetailValidator : AbstractValidator<RouteDetailRequest>
    {
        public CreateRouteDetailValidator()
        {
            RuleFor(x => x.OrderId)
                .NotNull().NotEmpty().WithMessage("El id de la orden es requerido")
                .Must(HasValidId).WithMessage("El id de la orden no es valido");
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
    }
}
