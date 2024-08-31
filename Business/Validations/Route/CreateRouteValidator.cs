using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Route
{
    public class CreateRouteValidator : AbstractValidator<RouteRequest>
    {
        public CreateRouteValidator()
        {
            RuleFor(x => x.PilotId).
                NotEmpty().WithMessage("El piloto es requerido para armar una ruta")
                .Must(HasValidId).WithMessage("El piloto no tiene un id valido");
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
