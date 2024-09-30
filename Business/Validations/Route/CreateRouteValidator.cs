using Business.Validations.RouteDetail;
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
            RuleFor(x => x.RouteDetails)
                .NotEmpty().WithMessage("La ruta debe tener al menos un detalle")
                .NotNull().WithMessage("La ruta debe tener al menos un detalle");
            RuleForEach(x => x.RouteDetails)
                .SetValidator(new CreateRouteDetailValidator());
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
    }
}
