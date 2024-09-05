using AutoMapper;
using Business.Interfaces;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using Entities.Response;
using FluentValidation;
using FluentValidation.Results;
using Humanizer;
using MongoDB.Driver;

namespace Business.Services
{
    public class OrderService(IMapper mapper, IMongoContext mongo, IServiceProvider serviceProvider, ILogger<OrderService> logger, IValidator<BulkUpdateOrderRequest> bulkValidator)  : EntityService<Order, OrderRequest, ObjectId>(mongo, mapper, serviceProvider, logger), IOrderService
    {
        private readonly IMongoContext _mongo = mongo;
        private readonly IMapper _mapper = mapper;
        public Response<List<Order>, List<ValidationFailure>> BulkUpdate(BulkUpdateOrderRequest model)
        {
            Response<List<Order>, List<ValidationFailure>> response = new();

            string userId = "";

            try
            {
                foreach (var entity in model.Orders)
                {
                    entity.UpdatedBy = model.UpdatedBy;
                }

                var results = bulkValidator.Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Validation failed";
                    response.Errors = results.Errors;
                    response.Data = null;

                    return response;
                }

                userId = model.UpdatedBy!;

                List<Order> entities = _mapper.Map<List<OrderRequest>, List<Order>>(model.Orders);

                string collectionName = nameof(Order).Pluralize();

                IMongoCollection<Order> database = _mongo.Database.GetCollection<Order>(collectionName);

                List<Order> existEntitiesUpdated = new List<Order>();

                foreach (var en in entities)
                {
                    Order? entityExist = database.Find(e => e.Id!.Equals(en.Id)).FirstOrDefault();

                    if (entityExist == null)
                    {
                        response.Success = false;
                        response.Message = $"Entity {nameof(Order)} not found";
                        response.Errors = [new ValidationFailure("Id", $"Entity {nameof(Order)} not found")];
                        response.Data = null;

                        return response;
                    }

                    DateTime createdAt = entityExist.CreatedAt;

                    Util.Util.UpdateProperties(entityExist, en);

                    entityExist.UpdatedAt = DateTime.Now.ToUniversalTime();
                    entityExist.CreatedAt = createdAt;

                    existEntitiesUpdated.Add(entityExist);
                }

                foreach (var en in existEntitiesUpdated)
                {
                    database.ReplaceOne(e => e.Id!.Equals(en.Id), en);
                }

                response.Errors = null;
                response.Data = entities;
                response.Success = true;
                response.Message = $"Entity {nameof(Order)} updated successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                logger.LogError(ex, "Error al crear {entity} : usuario {user} : {message}", nameof(Order), userId, ex.Message);

                return response;
            }
        }
    }
}
