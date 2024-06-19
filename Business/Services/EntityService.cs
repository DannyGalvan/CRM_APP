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
using MongoDB.Bson;
using MongoDB.Driver;

namespace Business.Services
{
    [AllArgsConstructor]
    public partial class EntityService<TEntity, TRequest, TId> : IEntityService<TEntity, TRequest, TId>
        where TEntity : class, IEntity<TId>
    {
        private readonly IMongoContext _context;
        private readonly IMapper _mapper;
        private readonly IServiceProvider _serviceProvider;
        private static readonly string[] separator = [" AND "];
        private static readonly string[] separatorArray = [" OR "];

        private IValidator<TRequest> GetValidator(string key)
        {
            return _serviceProvider.GetRequiredKeyedService<IValidator<TRequest>>(key);
        }

        public Response<TEntity, List<ValidationFailure>> Create(TRequest model)
        {
            Response<TEntity, List<ValidationFailure>> response = new();

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

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                return response;
            }
        }

        public Response<List<TEntity>, List<ValidationFailure>> GetAll(string? filters)
        {
            Response<List<TEntity>, List<ValidationFailure>> response = new();

            try
            {
                string collectionName = typeof(TEntity).Name.Pluralize();                

                IMongoCollection<TEntity> database = _context.Database.GetCollection<TEntity>(collectionName);

                var aggregate = database.Aggregate();              

                // Obtén todas las propiedades virtuales para hacer los $lookup
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

                // Obtén todas las propiedades virtuales para hacer los $lookup
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

                return response;
            }
        }

        public Response<TEntity, List<ValidationFailure>> PartialUpdate(TRequest model)
        {
            Response<TEntity, List<ValidationFailure>> response = new();

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

                TEntity? entityExist = database.Find(e => e.Id!.Equals(entityConvert.Id)).FirstOrDefault();

                if (entityExist == null)
                {
                    response.Success = false;
                    response.Message = $"Entity {typeof(TEntity).Name} not found";
                    response.Errors = [new ValidationFailure("Id", $"Entity {typeof(TEntity).Name} not found")];
                    response.Data = null;

                    return response;
                }

                DateTime createdAt = entityExist.CreatedAt;

                Util.Util.UpdateProperties(entityExist, entityConvert);

                entityExist.UpdatedAt = DateTime.Now.ToUniversalTime();
                entityExist.CreatedAt = createdAt;

                database.ReplaceOne(e => e.Id!.Equals(entityConvert.Id), entityExist);

                response.Errors = null;
                response.Data = entityExist;
                response.Success = true;
                response.Message = $"Entity {typeof(TEntity).Name} updated successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                return response;
            }
        }

        public Response<TEntity, List<ValidationFailure>> Update(TRequest model)
        {
            Response<TEntity, List<ValidationFailure>> response = new();

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

                TEntity? entityExist = database.Find(e => e.Id!.Equals(entity.Id)).FirstOrDefault();

                if (entityExist == null)
                {
                    response.Success = false;
                    response.Message = $"Entity {typeof(TEntity).Name} not found";
                    response.Errors = [new ValidationFailure("Id", $"Entity {typeof(TEntity).Name} not found")];
                    response.Data = null;

                    return response;
                }

                DateTime createdAt = entityExist.CreatedAt;

                Util.Util.UpdateProperties(entityExist, entity);

                entity.UpdatedAt = DateTime.Now.ToUniversalTime();
                entity.CreatedAt = createdAt;

                database.ReplaceOne(e => e.Id!.Equals(entity.Id), entityExist);

                response.Errors = null;
                response.Data = entityExist;
                response.Success = true;
                response.Message = $"Entity {typeof(TEntity).Name} updated successfully";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = [new ValidationFailure("Id", ex.Message)];
                response.Data = null;

                return response;
            }
        }

        private static FilterDefinition<TEntity> TranslateToMongoFilter(string? sqlQuery)
        {
            if (string.IsNullOrEmpty(sqlQuery))
            {
                return Builders<TEntity>.Filter.Empty;
            }
            // Dividir la consulta SQL en partes separadas por AND u OR
            var andParts = sqlQuery.Split(separator, StringSplitOptions.RemoveEmptyEntries);

            // Lista para almacenar filtros individuales
            var andFilters = new List<FilterDefinition<TEntity>>();

            // Procesar cada parte de la consulta
            foreach (var andPart in andParts)
            {
                // Dividir la parte AND en partes separadas por OR
                var orParts = andPart.Split(separatorArray, StringSplitOptions.RemoveEmptyEntries);

                // Lista para almacenar filtros de las partes OR
                var orFilters = new List<FilterDefinition<TEntity>>();

                // Procesar cada parte de la consulta OR
                foreach (var orPart in orParts)
                {
                    // Traducir la condición a un filtro de MongoDB
                    var filter = TranslateConditionToMongoFilter(orPart);

                    // Agregar el filtro a la lista de filtros OR
                    orFilters.Add(filter);
                }

                // Combinar los filtros OR con un operador OR
                if (andPart.Contains("OR"))
                {

                    andFilters.Add(Builders<TEntity>.Filter.Or(orFilters));
                }
                else
                {
                    andFilters.Add(Builders<TEntity>.Filter.And(orFilters));
                }
            }

            // Combinar los filtros AND con un operador AND
            var combinedAndFilter = Builders<TEntity>.Filter.And(andFilters);

            return combinedAndFilter;
        }

        private static FilterDefinition<TEntity> TranslateConditionToMongoFilter(string condition)
        {
            // Traducir una condición SQL individual a un filtro de MongoDB

            // Ejemplo: Name:like:libre
            var parts = condition.Split(':');

            bool isObjectId = HasValidId(parts[2]);

            object value = isObjectId ? ObjectId.Parse(parts[2]) : parts[2];

            FilterDefinition filterDefinition = new()
            {
                Field = parts[0],
                Operator = parts[1],
                Value = value
            };

            var filterBuilder = Builders<TEntity>.Filter;

            FilterDefinition<TEntity> individualFilter;

            individualFilter = filterDefinition.Operator.ToLower() switch
            {
                "eq" => filterBuilder.Eq(filterDefinition.Field, filterDefinition.Value),
                "ne" => filterBuilder.Ne(filterDefinition.Field, filterDefinition.Value),
                "gt" => filterBuilder.Gt(filterDefinition.Field, filterDefinition.Value),
                "lt" => filterBuilder.Lt(filterDefinition.Field, filterDefinition.Value),
                "like" => filterBuilder.Regex(filterDefinition.Field, new BsonRegularExpression(filterDefinition.Value.ToString(), "i")),
                "in" => filterBuilder.In(filterDefinition.Field, filterDefinition!.Value!.ToString()!.Split(",")),
                _ => throw new ArgumentException($"Unsupported filter operator: {filterDefinition.Operator}"),
            };

            return individualFilter;
        }

        private static bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
    }
}
