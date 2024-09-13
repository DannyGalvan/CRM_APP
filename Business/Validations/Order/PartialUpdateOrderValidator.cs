using Entities.Enums;
using Entities.Interfaces;
using Entities.Request;
using FluentValidation;
using Humanizer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Business.Validations.Order
{
    public class PartialupdateOrderValidator : AbstractValidator<OrderRequest>
    {
        private readonly IMongoContext _mongo;
        public PartialupdateOrderValidator(IMongoContext mongo)
        {
            _mongo = mongo;

            RuleFor(x => x.Id)
                 .NotEmpty().WithMessage("Id es requerido")
                 .NotNull().WithMessage("Id no puede ser nulo")
                 .Must(HasValidId).WithMessage("El Id no es valido");

            RuleFor(x => x.UpdatedBy)
                .NotEmpty().WithMessage("El usuario actualizador es requerido")
                .NotNull().WithMessage("El usuario actualizador no puede ser nulo");

            RuleFor(x => x.CreatedBy)
                .Null().WithMessage("El usuario creador no puede ser actualizado");

            RuleFor(x => x)
                .Custom((order, context) =>
                {
                    if (order.OrderStateId == OrderStatuses.Created.ToString()) return;
                   
                    // if state order request is deleted
                    if (order.OrderStateId == OrderStatuses.Deleted.ToString())
                    {
                        if (!VerifyStateOrderToDelete(order))
                        {
                            context.AddFailure("OrderStatusId", "La orden debe estar en estado creado para ser eliminada");
                        }
                    }
                    else
                    {
                        if (order.CustomerId != null)
                        {
                            context.AddFailure("CustomerId","Para modificar el cliente la orden debe estar en estado creada");
                        }

                        if (order.OrderDetails != null || !order.OrderDetails.IsNullOrEmpty())
                        {
                            context.AddFailure("OrderDetails","Para modificar los detalles de la orden la orden debe estar en estado creada");
                        }

                        if (order.PaymentTypeId != null)
                        {
                            context.AddFailure("PaymentTypeId","Para modificar el tipo de pago la orden debe estar en estado creada");
                        }
                    }

                });
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
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
    }
}
