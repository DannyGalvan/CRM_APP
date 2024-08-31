using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Route
{
    public class UpdateRouteValidator : AbstractValidator<RouteRequest>
    {
        public UpdateRouteValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El Id de la ruta es requerida")
                .Must(HasValidId).WithMessage("El Id no tiene un formato valido");
            RuleFor(x => x.PilotId).
                NotEmpty().WithMessage("El piloto es requerido para armar una ruta")
                .Must(HasValidId).WithMessage("El piloto no tiene un id valido");
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
