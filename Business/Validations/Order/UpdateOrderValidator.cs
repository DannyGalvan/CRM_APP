using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Order
{
    public class UpdateOrderValidator : AbstractValidator<OrderRequest>
    {
        public UpdateOrderValidator()
        {
            RuleFor(x => x.Id)
                 .NotEmpty().WithMessage("Id es requerido")
                 .NotNull().WithMessage("Id no puede ser nulo")
                 .Must(HasValidId).WithMessage("El Id no es valido");

            RuleFor(x => x.CustomerId)
                .NotEmpty().WithMessage("Customer Id is required");
            RuleFor(x => x.OrderDetails)
                .NotEmpty().WithMessage("Order Items are required");
            RuleForEach(x => x.OrderDetails).ChildRules(orderDetail =>
            {
                orderDetail.RuleFor(x => x.NumberLine)
                    .NotEmpty().WithMessage("Number Line is required")
                    .NotNull().WithMessage("Number Line cannot be null")
                    .GreaterThan(0).WithMessage("Number Line must be greater than 0");
                orderDetail.RuleFor(x => x.ProductId)
                    .NotNull().WithMessage("Producto no puede ser nulo")
                    .NotEmpty().WithMessage("El Producto es requerido");
                orderDetail.RuleFor(x => x.ProductName)
                    .NotEmpty().WithMessage("Nombre del Producto es requerido")
                    .NotNull().WithMessage("Nombre del Producto no puede ser nulo");
                orderDetail.RuleFor(x => x.Quantity)
                    .NotEmpty().WithMessage("Cantidad es requerida")
                    .NotNull().WithMessage("Cantidad no puede ser nula")
                    .GreaterThan(0).WithMessage("Cantidad debe ser mayor a 0");
                orderDetail.RuleFor(x => x.UnitPrice)
                    .NotEmpty().WithMessage("Precio Unitario es requerido")
                    .NotNull().WithMessage("Precio Unitario no puede ser nulo")
                    .GreaterThan(0).WithMessage("Precio Unitario debe ser mayor a 0");
            });

            RuleFor(x => x.UpdatedBy)
                .NotEmpty().WithMessage("El usuario actualizador es requerido")
                .NotNull().WithMessage("El usuario actualizador no puede ser nulo");

            RuleFor(x => x.CreatedBy)
                .Null().WithMessage("El usuario creador no puede ser actualizado");
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
    }
}
