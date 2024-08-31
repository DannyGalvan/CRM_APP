using AutoMapper;
using Business.Interfaces;
using Entities.Interfaces;
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation;
using FluentValidation.Results;
using Humanizer;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Business.Services
{
    public class RouteDetailService(IMapper mapper, IMongoContext mongo, IServiceProvider serviceProvider, ILogger<RouteDetailService> logger, IValidator<BulkRouteDetailRequest> bulkValidator) : EntityService<RouteDetail, RouteDetailRequest, ObjectId>(mongo, mapper, serviceProvider, logger), IRouteDetailService
    {
        private readonly IMongoContext _mongo = mongo;
        private readonly IMapper _mapper = mapper;

        public Response<List<RouteDetail>, List<ValidationFailure>> Bulk(BulkRouteDetailRequest model)
        {
            Response<List<RouteDetail>, List<ValidationFailure>> response = new();

            string userId = "";

            try
            {
                foreach (var entity in model.RouteDetails)
                {
                    entity.CreatedBy = model.CreatedBy;
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

                userId = model.CreatedBy!;

                List<RouteDetail> entities = _mapper.Map<List<RouteDetailRequest>,List<RouteDetail>>(model.RouteDetails);

                foreach (var entity in entities)
                {
                    entity.CreatedAt = DateTime.Now.ToUniversalTime();
                    entity.UpdatedAt = null;
                    entity.UpdatedBy = null;
                }

                string collectionName = nameof(RouteDetail).Pluralize();

                IMongoCollection<RouteDetail> database = _mongo.Database.GetCollection<RouteDetail>(collectionName);

                database.InsertMany(entities);

                response.Errors = null;
                response.Data = entities;
                response.Success = true;
                response.Message = $"Entity {nameof(RouteDetail)} created successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                logger.LogError(ex, "Error al crear {entity} : usuario {user} : {message}", nameof(RouteDetail), userId, ex.Message);

                return response;
            }
        }
    }
}
