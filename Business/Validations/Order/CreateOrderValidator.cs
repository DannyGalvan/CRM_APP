using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.Order
{
    public class CreateOrderValidator : AbstractValidator<OrderRequest>
    {
        public CreateOrderValidator()
        {
            RuleFor(x => x.CustomerId)
                .NotEmpty().WithMessage("El Cliente es requerido")
                .Must(HasValidId).WithMessage("El Cliente no es valido");
            RuleFor(x => x.CustomerDirectionId)
                .NotEmpty().WithMessage("La direccion del cliente es requerida")
                .Must(HasValidId).WithMessage("La direccion del cliente no es valida");
            RuleFor(x => x.PaymentTypeId)
                .NotEmpty().WithMessage("El tipo de pago es requerido")
                .Must(HasValidId).WithMessage("El tipo de pago no es valido");
            RuleFor(x => x.OrderStateId)
                .NotEmpty().WithMessage("El estado es requerido")
                .Must(HasValidId).WithMessage("El estado no es valido");
            RuleFor(x => x.OrderDetails)
                .NotEmpty().WithMessage("Order Items are required");
            RuleForEach(x => x.OrderDetails).ChildRules(orderDetail =>
            {
                orderDetail.RuleFor(x => x.NumberLine)
                    .NotEmpty().WithMessage("El Numero de linea es requerido")
                    .NotNull().WithMessage("El Numero de linea no puede ser nulo")
                    .GreaterThan(0).WithMessage("El Numero de linea debe ser mayor a 0");
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
