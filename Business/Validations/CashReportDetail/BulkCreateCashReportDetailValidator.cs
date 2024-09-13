using Entities.Request;
using FluentValidation;

namespace Business.Validations.CashReportDetail
{
    public class BulkCreateCashReportDetailValidator : AbstractValidator<BulkCashReportDetailRequest>
    {
        public BulkCreateCashReportDetailValidator()
        {
            RuleFor(x => x.CashReportDetails)
                .NotNull().NotEmpty().WithMessage("Los detalles de la ruta son requeridos");
            RuleForEach(x => x.CashReportDetails)
                .SetValidator(new CreateCashReportDetailValidator());
        }
    }
}
