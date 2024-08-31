using Entities.Request;
using FluentValidation;

namespace Business.Validations.RouteDetail
{
    public class BulkRouteDetailValidator : AbstractValidator<BulkRouteDetailRequest>
    {
        public BulkRouteDetailValidator()
        {
            RuleFor(x => x.RouteDetails)
                .NotNull().NotEmpty().WithMessage("Los detalles de la ruta son requeridos");
            RuleForEach(x => x.RouteDetails)
                .SetValidator(new CreateRouteDetailValidator());
        }
    }
}
