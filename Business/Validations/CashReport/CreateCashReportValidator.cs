
using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.CashReport
{
    public class CreateCashReportValidator : AbstractValidator<CashReportRequest>
    {
        public CreateCashReportValidator()
        {
            RuleFor(x => x.CashierName)
                .NotEmpty().WithMessage("El nombre del cajero es requerido")
                .Length(3, 50).WithMessage("El Nombre del cajero debe tener mas de 3 caracteres y menos de 50");
            RuleFor(x => x.Orders)
                .NotEmpty().WithMessage("Debes asignar al menos una orden")
                .NotNull().WithMessage("No Hay ordenes asignadas");
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
