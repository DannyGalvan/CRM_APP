using Business.Interfaces;
using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Route
{
    public class PartialUpdateRouteValidator : AbstractValidator<RouteRequest>
    {
        public PartialUpdateRouteValidator(IRouteVerification routeVerification)
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id del producto es requerido")
                .Must(HasValidId).WithMessage("El Id no tiene un formato valido")
                .Must(routeVerification.VerifyStateOrderToDeleteOrUpdateRoute!)
                .OverridePropertyName("Observations")
                .WithMessage("Las ordenes de esta ruta ya tienen un corte asignado, La ruta no puede ser modificada");
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
