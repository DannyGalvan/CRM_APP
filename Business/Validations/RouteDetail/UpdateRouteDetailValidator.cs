using Business.Interfaces;
using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.RouteDetail
{
    public class UpdateRouteDetailValidator : AbstractValidator<RouteDetailRequest>
    {
        public UpdateRouteDetailValidator(IRouteVerification routeVerification)
        {
            RuleFor(x => x.Id)
                .NotNull().NotEmpty().WithMessage("El id del detalle de la ruta es requerido")
                .Must(HasValidId).WithMessage("El id del detalle de la ruta no es valido");
            RuleFor(x => x.RouteId)
                .NotNull().NotEmpty().WithMessage("El id de la ruta es requerido")
                .Must(HasValidId).WithMessage("El id de la ruta no es valido")
                .Must(routeVerification.VerifyStateOrderToDeleteOrUpdateRoute!)
                .WithMessage("Las ordenes de esta ruta ya tienen un corte asignado, La ruta no puede ser modificada");
            RuleFor(x => x.OrderId)
                .NotNull().NotEmpty().WithMessage("El id de la orden es requerido")
                .Must(HasValidId).WithMessage("El id de la orden no es valido");
            RuleFor(x => x.CreatedBy)
                .Null().WithMessage("El Usuario creador no puede ser modificado");
            RuleFor(x => x.UpdatedBy)
                .NotNull().WithMessage("El Usuario actualizador no puede ser nulo")
                .NotEmpty().WithMessage("El Usuario actualizador no puede ser vacio")
                .Must(HasValidId).WithMessage("El Usuario actualizador no es valido");
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
    }
}
