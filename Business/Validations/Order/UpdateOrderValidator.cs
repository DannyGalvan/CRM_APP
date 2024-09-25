using Entities.Enums;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using FluentValidation;
using Humanizer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Business.Validations.Order
{
    public class UpdateOrderValidator : AbstractValidator<OrderRequest>
    {
        private readonly IMongoContext _mongo;
        public UpdateOrderValidator(IMongoContext mongo)
        {
            _mongo = mongo;

            RuleFor(x => x.Id)
                 .NotEmpty().WithMessage("Id es requerido")
                 .NotNull().WithMessage("Id no puede ser nulo")
                 .Must(HasValidId).WithMessage("El Id no es valido");

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
                .NotEmpty().WithMessage("Los productos de la orden son requeridos");
            RuleFor(x => x.OrderDetails)
                .Must(ContainsDeliveryItem).WithMessage("La orden debe contener el costo de envio");
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

            RuleFor(x => x.UpdatedBy)
                .NotEmpty().WithMessage("El usuario actualizador es requerido")
                .NotNull().WithMessage("El usuario actualizador no puede ser nulo");

            RuleFor(x => x.CreatedBy)
                .Null().WithMessage("El usuario creador no puede ser actualizado");

            RuleFor(x => x)
                .Custom((updatedOrder, context) =>
                {
                    var orders = _mongo.Database.GetCollection<Entities.Models.Order>(nameof(Order).Pluralize());

                    var order = orders.Find(x => x.Id.Equals(ObjectId.Parse(updatedOrder.Id))).FirstOrDefault();

                    if (order == null)
                    {
                        context.AddFailure("OrderDetails", "La orden no existe");

                        return;
                    }

                    if (HasValidUpdatedStock(order.OrderDetails, updatedOrder.OrderDetails!, out string message)) return;

                    context.AddFailure("OrderDetails", message);
                });

            RuleFor(x => x)
                .Custom((order, context) =>
                {
                    if (order.OrderStateId == OrderStatuses.Created.ToString()) return;

                    // if state order request is deleted
                    if (order.OrderStateId == OrderStatuses.Deleted.ToString())
                    {
                        if (!VerifyStateOrderToDelete(order))
                        {
                            context.AddFailure("OrderDetails","La orden debe estar en estado creado para ser eliminada");
                        }
                    }
                    else
                    {
                        if (order.CustomerId != null)
                        {
                            context.AddFailure("CustomerId", "Para modificar el cliente la orden debe estar en estado creada");
                        }

                        if (order.OrderDetails != null || !order.OrderDetails.IsNullOrEmpty())
                        {
                            context.AddFailure("OrderDetails", "Para modificar los detalles de la orden la orden debe estar en estado creada");
                        }

                        if (order.PaymentTypeId != null)
                        {
                            context.AddFailure("PaymentTypeId", "Para modificar el tipo de pago la orden debe estar en estado creada");
                        }
                    }

                });
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
        private bool ContainsDeliveryItem(List<OrderDetailRequest>? details)
        {
            return details != null && details.Any(x => x.ProductName!.ToLower().Contains("envio"));
        }

        private bool VerifyStateOrderToDelete(OrderRequest order)
        {
            string collectionName = nameof(Order).Pluralize();
            IMongoCollection<Entities.Models.Order> database = _mongo.Database.GetCollection<Entities.Models.Order>(collectionName);

            var entityExist = database.Find(e => e.Id.Equals(ObjectId.Parse(order.Id))).FirstOrDefault();

            if (entityExist == null)
            {
                return false;
            }

            if (entityExist.OrderStateId != OrderStatuses.Created)
            {
                return false;
            }

            return true;
        }

        private bool HasValidUpdatedStock(List<OrderDetail> prevDetails, List<OrderDetailRequest> updatedDetails, out string message)
        {
            bool isValid = true;
            message = "No hay stock suficiente para los siguientes productos: ";

            var products = _mongo.Database.GetCollection<Entities.Models.Product>(nameof(Product).Pluralize());

            foreach (var updateDetail in updatedDetails.Where(x => !x.ProductName!.ToLower().Contains("envio")))
            {
                var product = products.Find(x => x.Id.Equals(ObjectId.Parse(updateDetail.ProductId))).FirstOrDefault();

                if (product == null)
                {
                    isValid = false;
                    break;
                }

                var prevDetail = prevDetails.FirstOrDefault(x => x.ProductId.Equals(ObjectId.Parse(updateDetail.ProductId)));

                if (prevDetail != null)
                {
                    int stock = product.Stock + prevDetail.Quantity;

                    if (stock >= updateDetail.Quantity) continue;

                    isValid = false;
                    message += $"{product.Name}, ";
                    break;
                }
                else
                {
                    if (product.Stock >= updateDetail.Quantity) continue;

                    isValid = false;
                    message += $"{product.Name}, ";
                    break;
                }
            }

            return isValid;
        }
    }
}
