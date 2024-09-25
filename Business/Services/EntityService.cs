using AutoMapper;
using Business.Interfaces;
using Entities.Interfaces;
using Entities.Request;
using Entities.Response;
using FluentValidation;
using FluentValidation.Results;
using Humanizer;
using Lombok.NET;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Globalization;
using System.Reflection;
using Business.Interfaces.Interceptors;
using Business.Util;

namespace Business.Services
{
    [AllArgsConstructor]
    public partial class EntityService<TEntity, TRequest, TId> : IEntityService<TEntity, TRequest, TId>
        where TEntity : class, IEntity<TId>
    {
        private readonly IMongoContext _context;
        private readonly IMapper _mapper;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<EntityService<TEntity, TRequest, TId>> _logger;

        private IValidator<TRequest> GetValidator(string key)
        {
            return _serviceProvider.GetRequiredKeyedService<IValidator<TRequest>>(key);
        }

        private IEnumerable<IEntityAfterCreateInterceptor<TEntity,TRequest>> GetAfterCreateInterceptors()
        {
            return _serviceProvider.GetServices<IEntityAfterCreateInterceptor<TEntity, TRequest>>().OrderBy(i => i.GetType().GetCustomAttribute<OrderAttribute>()?.Priority ?? int.MaxValue);
        }

        private IEnumerable<IEntityAfterUpdateInterceptor<TEntity, TRequest>> GetAfterUpdateInterceptors()
        {
            return _serviceProvider.GetServices<IEntityAfterUpdateInterceptor<TEntity, TRequest>>().OrderBy(i => i.GetType().GetCustomAttribute<OrderAttribute>()?.Priority ?? int.MaxValue);
        }

        private IEnumerable<IEntityAfterPartialUpdateInterceptor<TEntity, TRequest>> GetPartialUpdateInterceptors()
        {
            return _serviceProvider.GetServices<IEntityAfterPartialUpdateInterceptor<TEntity, TRequest>>().OrderBy(i => i.GetType().GetCustomAttribute<OrderAttribute>()?.Priority ?? int.MaxValue);
        }

        public Response<TEntity, List<ValidationFailure>> Create(TRequest model)
        {
            Response<TEntity, List<ValidationFailure>> response = new();

            string userId = "";

            try
            {

                var results = GetValidator("Create").Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Validation failed";
                    response.Errors = results.Errors;
                    response.Data = null;

                    return response;
                }


                TEntity entity = _mapper.Map<TEntity>(model);

                userId = entity.CreatedBy.ToString();

                entity.CreatedAt = DateTime.Now.ToUniversalTime();
                entity.UpdatedAt = null;
                entity.UpdatedBy = null;

                string collectionName = typeof(TEntity).Name.Pluralize();

                IMongoCollection<TEntity> database = _context.Database.GetCollection<TEntity>(collectionName);

                database.InsertOne(entity);

                response.Errors = null;
                response.Data = entity;
                response.Success = true;
                response.Message = $"Entity {typeof(TEntity).Name} created successfully";

                if (!response.Success) return response;

                foreach (var interceptor in GetAfterCreateInterceptors())
                {
                    if (!response.Success) return response;

                    response = interceptor.Execute(response, model);
                }

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                _logger.LogError(ex, "Error al crear {entity} : usuario {user} : {message}", typeof(TEntity).Name, userId, ex.Message);

                return response;
            }
        }

        public Response<List<TEntity>, List<ValidationFailure>> GetAll(string? filters, bool? thenInclude = false)
        {
            Response<List<TEntity>, List<ValidationFailure>> response = new();

            try
            {
                string collectionName = typeof(TEntity).Name.Pluralize();                

                IMongoCollection<TEntity> database = _context.Database.GetCollection<TEntity>(collectionName);

                var aggregate = database.Aggregate();

                // Get all the virtual properties to make the $lookups
                var properties = typeof(TEntity).GetProperties()
                    .Where(p => p.GetGetMethod()!.IsVirtual && p.PropertyType.IsClass);

                foreach (var property in properties)
                {
                    var foreignKey = property.Name + "Id";
                    var foreignKeyProperty = typeof(TEntity).GetProperty(foreignKey);

                    if (foreignKeyProperty == null) continue;

                    var relatedCollectionName = property.Name.Pluralize();
                    var lookupStage = new BsonDocument("$lookup", new BsonDocument
                    {
                        { "from", relatedCollectionName },
                        { "localField", foreignKey },
                        { "foreignField", "_id" },
                        { "as", property.Name }
                    });
                    aggregate = aggregate.AppendStage<TEntity>(lookupStage);

                    // Flatten the resulting array (MongoDB $lookup returns an array)
                    var unwindStage = new BsonDocument("$unwind", new BsonDocument
                    {
                        { "path", $"${property.Name}" },
                        { "preserveNullAndEmptyArrays", true }
                    });

                    aggregate = aggregate.AppendStage<TEntity>(unwindStage);

                    if (!thenInclude ?? true) continue;

                    var secondLevelProperties = property.PropertyType.GetProperties()
                        .Where(p => p.GetGetMethod()!.IsVirtual && p.PropertyType.IsClass);

                    foreach (var secondLevelProperty in secondLevelProperties)
                    {
                        var secondLevelForeignKey = secondLevelProperty.Name + "Id";
                        var secondLevelForeignKeyProperty = property.PropertyType.GetProperty(secondLevelForeignKey);

                        if (secondLevelForeignKeyProperty == null) continue;

                        var secondLevelRelatedCollectionName = secondLevelProperty.Name.Pluralize();
                        var secondLevelLookupStage = new BsonDocument("$lookup", new BsonDocument
                        {
                            { "from", secondLevelRelatedCollectionName },
                            { "localField", $"{property.Name}.{secondLevelForeignKey}" },
                            { "foreignField", "_id" },
                            { "as", $"{property.Name}.{secondLevelProperty.Name}" }
                        });
                        aggregate = aggregate.AppendStage<TEntity>(secondLevelLookupStage);

                        // Flatten the resulting array (MongoDB $lookup returns an array)
                        var secondLevelUnwindStage = new BsonDocument("$unwind", new BsonDocument
                        {
                            { "path", $"${property.Name}.{secondLevelProperty.Name}" },
                            { "preserveNullAndEmptyArrays", true }
                        });

                        aggregate = aggregate.AppendStage<TEntity>(secondLevelUnwindStage);
                    }
                }

                if (!string.IsNullOrEmpty(filters))
                {
                    var filter = TranslateToMongoFilter(filters);
                    aggregate = aggregate.Match(filter);
                }

                var entities = aggregate.ToList();

                response.Errors = null;
                response.Data = entities;
                response.Success = true;
                response.Message = $"Entities {typeof(TEntity).Name} retrieved successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                _logger.LogError(ex, "Error al obtener {entity} : {message}", typeof(TEntity).Name, ex.Message);

                return response;
            }
        }

        public Response<TEntity, List<ValidationFailure>> GetById(TId id)
        {
            Response<TEntity, List<ValidationFailure>> response = new();

            try
            {
                string collectionName = typeof(TEntity).Name.Pluralize();

                IMongoCollection<TEntity> database = _context.Database.GetCollection<TEntity>(collectionName);

                var aggregate = database.Aggregate();

                // Get all the virtual properties to make the $lookups
                var properties = typeof(TEntity).GetProperties()
                    .Where(p => p.GetGetMethod()!.IsVirtual && p.PropertyType.IsClass);

                foreach (var property in properties)
                {
                    var foreignKey = property.Name + "Id";
                    var foreignKeyProperty = typeof(TEntity).GetProperty(foreignKey);

                    if (foreignKeyProperty != null)
                    {
                        var relatedCollectionName = property.Name.Pluralize();
                        var lookupStage = new BsonDocument("$lookup", new BsonDocument
                        {
                            { "from", relatedCollectionName },
                            { "localField", foreignKey },
                            { "foreignField", "_id" },
                            { "as", property.Name }
                        });
                        aggregate = aggregate.AppendStage<TEntity>(lookupStage);

                        // Flatten the resulting array (MongoDB $lookup returns an array)
                        var unwindStage = new BsonDocument("$unwind", new BsonDocument
                        {
                            { "path", $"${property.Name}" },
                            { "preserveNullAndEmptyArrays", true }
                        });

                        aggregate = aggregate.AppendStage<TEntity>(unwindStage);
                    }
                }

                TEntity entity = aggregate.Match(e => e.Id!.Equals(id)).FirstOrDefault();

                response.Errors = null;
                response.Data = entity;
                response.Success = true;
                response.Message = "Entity retrieved successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                _logger.LogError(ex, "Error al obtener {entity} : {message}", typeof(TEntity).Name, ex.Message);

                return response;
            }
        }

        public Response<TEntity, List<ValidationFailure>> PartialUpdate(TRequest model)
        {
            Response<TEntity, List<ValidationFailure>> response = new();

            string userId = "";

            try
            {
                var results = GetValidator("PartialUpdate").Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Validation failed";
                    response.Errors = results.Errors;
                    response.Data = null;

                    return response;
                }

                TEntity entityConvert = _mapper.Map<TEntity>(model);

                string collectionName = typeof(TEntity).Name.Pluralize();

                IMongoCollection<TEntity> database = _context.Database.GetCollection<TEntity>(collectionName);

                TEntity? prevState = database.Find(e => e.Id!.Equals(entityConvert.Id)).FirstOrDefault();

                TEntity? entityExist = _mapper.Map<TEntity>(prevState);

                if (entityExist == null)
                {
                    response.Success = false;
                    response.Message = $"Entity {typeof(TEntity).Name} not found";
                    response.Errors = [new ValidationFailure("Id", $"Entity {typeof(TEntity).Name} not found")];
                    response.Data = null;

                    return response;
                }

                userId = entityExist.CreatedBy.ToString();

                DateTime createdAt = entityExist.CreatedAt;

                Util.Util.UpdateProperties(entityExist, entityConvert);

                entityExist.UpdatedAt = DateTime.Now.ToUniversalTime();
                entityExist.CreatedAt = createdAt;

                database.ReplaceOne(e => e.Id!.Equals(entityConvert.Id), entityExist);

                response.Errors = null;
                response.Data = entityExist;
                response.Success = true;
                response.Message = $"Entity {typeof(TEntity).Name} updated successfully";

                if (!response.Success) return response;

                foreach (var interceptor in GetPartialUpdateInterceptors())
                {
                    if (!response.Success) return response;

                    response = interceptor.Execute(response, model, prevState);
                }

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                _logger.LogError(ex, "Error al actualizar parcial {entity} : usuario {user} : {message}", typeof(TEntity).Name, userId, ex.Message);

                return response;
            }
        }

        public Response<TEntity, List<ValidationFailure>> Update(TRequest model)
        {
            Response<TEntity, List<ValidationFailure>> response = new();

            string userId = "";

            try
            {
                var results = GetValidator("Update").Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Validation failed";
                    response.Errors = results.Errors;
                    response.Data = null;

                    return response;
                }

                TEntity entity = _mapper.Map<TEntity>(model);

                string collectionName = typeof(TEntity).Name.Pluralize();

                IMongoCollection<TEntity> database = _context.Database.GetCollection<TEntity>(collectionName);

                TEntity? prevState = database.Find(e => e.Id!.Equals(entity.Id)).FirstOrDefault();

                TEntity? entityExist = _mapper.Map<TEntity>(prevState);

                if (entityExist == null)
                {
                    response.Success = false;
                    response.Message = $"Entity {typeof(TEntity).Name} not found";
                    response.Errors = [new ValidationFailure("Id", $"Entity {typeof(TEntity).Name} not found")];
                    response.Data = null;

                    return response;
                }

                userId = entityExist.CreatedBy.ToString();

                DateTime createdAt = entityExist.CreatedAt;

                Util.Util.UpdateProperties(entityExist, entity);

                entityExist.UpdatedAt = DateTime.Now.ToUniversalTime();
                entityExist.CreatedAt = createdAt;

                database.ReplaceOne(e => e.Id!.Equals(entity.Id), entityExist);

                response.Errors = null;
                response.Data = entityExist;
                response.Success = true;
                response.Message = $"Entity {typeof(TEntity).Name} updated successfully";

                if (!response.Success) return response;

                foreach (var interceptor in GetAfterUpdateInterceptors())
                {
                    if (!response.Success) return response;

                    response = interceptor.Execute(response, model, prevState);
                }

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                _logger.LogError(ex, "Error al actualizar {entity} : usuario {user} : {message}", typeof(TEntity).Name, userId, ex.Message);

                return response;
            }
        }

        private FilterDefinition<TEntity> TranslateToMongoFilter(string? sqlQuery)
        {
            if (string.IsNullOrEmpty(sqlQuery))
            {
                return Builders<TEntity>.Filter.Empty;
            }

            string[] separatorAnd = [" AND "];

            // Split the SQL query into parts separated by AND or OR
            var andParts = sqlQuery.Split(separatorAnd, StringSplitOptions.RemoveEmptyEntries);

            // List to store individual filters
            var andFilters = new List<FilterDefinition<TEntity>>();

            string[] separatorOr = [" OR "];

            // Process each part of the query
            foreach (var andPart in andParts)
            {
                // Split the AND part into parts separated by OR
                var orParts = andPart.Split(separatorOr, StringSplitOptions.RemoveEmptyEntries);

                // List to store filters from OR parts
                var orFilters = new List<FilterDefinition<TEntity>>();

                // Process each part of the OR query
                foreach (var orPart in orParts)
                {
                    // Translate the condition to a MongoDB filter
                    var filter = TranslateConditionToMongoFilter(orPart);

                    // Add the filter to the OR filter list
                    orFilters.Add(filter);
                }

                // Combine OR filters with an OR operator
                andFilters.Add(andPart.Contains("OR")
                    ? Builders<TEntity>.Filter.Or(orFilters)
                    : Builders<TEntity>.Filter.And(orFilters));
            }

            // Combine AND filters with an AND operator
            var combinedAndFilter = Builders<TEntity>.Filter.And(andFilters);

            return combinedAndFilter;
        }

        private FilterDefinition<TEntity> TranslateConditionToMongoFilter(string condition)
        {
            // Translate a single SQL condition to a MongoDB filter

            // Example: Name:like:free
            var parts = condition.Split(':');

            bool isObjectId = HasValidId(parts[2]);

            object value = isObjectId ? ObjectId.Parse(parts[2]) : parts[2];

            bool isDate = HasValidDate(parts[2]);

            value = isDate ? DateTime.ParseExact(parts[2], "yyyy-MM-ddTHH", CultureInfo.InvariantCulture) : value;

            FilterDefinition filterDefinition = new()
            {
                Field = parts[0],
                Operator = parts[1],
                Value = value
            };

            var filterBuilder = Builders<TEntity>.Filter;

            FilterDefinition<TEntity> individualFilter = filterDefinition.Operator.ToLower() switch
            {
                "eq" => filterBuilder.Eq(filterDefinition.Field, filterDefinition.Value),
                "ne" => filterBuilder.Ne(filterDefinition.Field, filterDefinition.Value),
                "gt" => filterBuilder.Gte(filterDefinition.Field, filterDefinition.Value),
                "lt" => filterBuilder.Lte(filterDefinition.Field, filterDefinition.Value),
                "like" => filterBuilder.Regex(filterDefinition.Field, new BsonRegularExpression(filterDefinition.Value.ToString(), "i")),
                "in" => filterBuilder.In(filterDefinition.Field, filterDefinition.Value.ToString()!.Split(",")),
                _ => throw new ArgumentException($"Unsupported filter operator: {filterDefinition.Operator}"),
            };

            return individualFilter;
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }

        private bool HasValidDate(string? date)
        {
            return DateTime.TryParseExact(date, "yyyy-MM-ddTHH", CultureInfo.InvariantCulture, DateTimeStyles.None, out _);
        }
    }
}
