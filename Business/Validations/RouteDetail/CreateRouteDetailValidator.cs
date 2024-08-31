using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.RouteDetail
{
    public class CreateRouteDetailValidator : AbstractValidator<RouteDetailRequest>
    {
        public CreateRouteDetailValidator()
        {
            RuleFor(x => x.RouteId)
                .NotNull().NotEmpty().WithMessage("El id de la ruta es requerido")
                .Must(HasValidId).WithMessage("El id de la ruta no es valido");
            RuleFor(x => x.OrderId)
                .NotNull().NotEmpty().WithMessage("El id de la orden es requerido")
                .Must(HasValidId).WithMessage("El id de la orden no es valido");
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
