using AutoMapper;
using Business.Interfaces;
using Entities.Context;
using Entities.Interfaces;
using Entities.Models;
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
    public partial class CatalogueService : ICatalogueService
    {
        private readonly IMongoContext _mongo;
        private readonly IMapper _mapper;
        private readonly IServiceProvider _serviceProvider;
        private static readonly string[] separator = [" AND "];
        private static readonly string[] separatorArray = [" OR "];

        private IValidator<CatalogueRequest> GetValidator(string key)
        {
            return _serviceProvider.GetRequiredKeyedService<IValidator<CatalogueRequest>>(key);
        }

        public Response<Catalogue, List<ValidationFailure>> Create(CatalogueRequest model, string bd)
        {
            Response<Catalogue, List<ValidationFailure>> response = new();

            try
            {
                string collectionName = typeof(Collection).Name.Pluralize();

                IMongoCollection<Collection> Collections = _mongo.Database.GetCollection<Collection>(collectionName);

                Collection exist = Collections.Find(c => c.Name == bd).FirstOrDefault();

                if (exist == null)
                {
                    response.Success = false;
                    response.Message = $"Collection {bd} not found";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                if (exist.IsReadOnly)
                {
                    response.Success = false;
                    response.Message = $"Collection {bd} is read only";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                var results = GetValidator("Create").Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Validation failed";
                    response.Errors = results.Errors;
                    response.Data = null;

                    return response;
                }

                Catalogue catalogue = _mapper.Map<Catalogue>(model);
                catalogue.UpdatedAt = null;
                catalogue.UpdatedBy = null;

                IMongoCollection<Catalogue> collection = _mongo.Database.GetCollection<Catalogue>(bd);
                collection.InsertOne(catalogue);

                response.Errors = null;
                response.Data = catalogue;
                response.Success = true;
                response.Message = $"Catalogue {bd} created successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = null;
                response.Data = null;

                return response;
            }
        }

        public Response<List<Catalogue>, List<ValidationFailure>> GetAll(string bd, string? filter)
        {
            Response<List<Catalogue>, List<ValidationFailure>> response = new();

            try
            {
                string collectionName = typeof(Collection).Name.Pluralize();

                IMongoCollection<Collection> Collections = _mongo.Database.GetCollection<Collection>(collectionName);

                Collection exist = Collections.Find(c => c.Name == bd).FirstOrDefault();

                if (exist == null)
                {
                    response.Success = false;
                    response.Message = $"Collection {bd} not found";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }               

                IMongoCollection<Catalogue> collection = _mongo.Database.GetCollection<Catalogue>(bd);                

                List<Catalogue> searchResult = collection.Find(TranslateToMongoFilter(filter)).ToList();

                response.Errors = null;
                response.Data = searchResult;
                response.Success = true;
                response.Message = $"Catalogues {bd} retrieved successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = null;
                response.Data = null;

                return response;
            }
        }

        public Response<Catalogue, List<ValidationFailure>> GetById(ObjectId id, string bd)
        {
            Response<Catalogue, List<ValidationFailure>> response = new();

            try
            {
                string collectionName = typeof(Collection).Name.Pluralize();

                IMongoCollection<Collection> Collections = _mongo.Database.GetCollection<Collection>(collectionName);

                Collection exist = Collections.Find(c => c.Name == bd).FirstOrDefault();

                if (exist == null)
                {
                    response.Success = false;
                    response.Message = $"Collection {bd} not found";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                IMongoCollection<Catalogue> collection = _mongo.Database.GetCollection<Catalogue>(bd);

                Catalogue searchResult = collection.Find(c => c.Id == id).FirstOrDefault();

                response.Errors = null;
                response.Data = searchResult;
                response.Success = true;
                response.Message = $"Catalogue {bd} retrieved successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = null;
                response.Data = null;

                return response;
            }
        }

        public Response<Catalogue, List<ValidationFailure>> PartialUpdate(CatalogueRequest model, string bd)
        {
            Response<Catalogue, List<ValidationFailure>> response = new();

            try
            {
                string collectionName = typeof(Collection).Name.Pluralize();

                IMongoCollection<Collection> Collections = _mongo.Database.GetCollection<Collection>(collectionName);

                Collection exist = Collections.Find(c => c.Name == bd).FirstOrDefault();

                if (exist == null)
                {
                    response.Success = false;
                    response.Message = $"Collection {bd} not found";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                if (exist.IsReadOnly)
                {
                    response.Success = false;
                    response.Message = $"Collection {bd} is read only";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                var results = GetValidator("PartialUpdate").Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Validation failed";
                    response.Errors = results.Errors;
                    response.Data = null;

                    return response;
                }

                Catalogue catalogue = _mapper.Map<Catalogue>(model);

                IMongoCollection<Catalogue> collection = _mongo.Database.GetCollection<Catalogue>(bd);
                Catalogue entityExist = collection.Find(c => c.Id == catalogue.Id).FirstOrDefault();

                if (entityExist == null)
                {
                    response.Success = false;
                    response.Message = $"Catalogue {bd} not found";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                DateTime createdAt = entityExist.CreatedAt;

                Util.Util.UpdateProperties(entityExist, catalogue);

                entityExist.UpdatedAt = DateTime.Now.ToUniversalTime();
                entityExist.CreatedAt = createdAt;

                collection.ReplaceOne(c => c.Id == catalogue.Id, catalogue);

                response.Errors = null;
                response.Data = catalogue;
                response.Success = true;
                response.Message = $"Catalogue {bd} updated successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = null;
                response.Data = null;

                return response;
            }
        }

        public Response<Catalogue, List<ValidationFailure>> Update(CatalogueRequest model, string bd)
        {
            Response<Catalogue, List<ValidationFailure>> response = new();

            try
            {
                string collectionName = typeof(Collection).Name.Pluralize();

                IMongoCollection<Collection> Collections = _mongo.Database.GetCollection<Collection>(collectionName);

                Collection exist = Collections.Find(c => c.Name == bd).FirstOrDefault();

                if (exist == null)
                {
                    response.Success = false;
                    response.Message = $"Collection {bd} not found";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                if (exist.IsReadOnly)
                {
                    response.Success = false;
                    response.Message = $"Collection {bd} is read only";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                var results = GetValidator("Update").Validate(model);

                if (!results.IsValid)
                {
                    response.Success = false;
                    response.Message = "Validation failed";
                    response.Errors = results.Errors;
                    response.Data = null;

                    return response;
                }

                Catalogue catalogue = _mapper.Map<Catalogue>(model);

                IMongoCollection<Catalogue> collection = _mongo.Database.GetCollection<Catalogue>(bd);

                Catalogue entityExist = collection.Find(c => c.Id == catalogue.Id).FirstOrDefault();

                if (entityExist == null)
                {
                    response.Success = false;
                    response.Message = $"Catalogue {bd} not found";
                    response.Errors = null;
                    response.Data = null;

                    return response;
                }

                DateTime createdAt = entityExist.CreatedAt;

                Util.Util.UpdateProperties(entityExist, catalogue);

                entityExist.UpdatedAt = DateTime.Now.ToUniversalTime();
                entityExist.CreatedAt = createdAt;

                collection.ReplaceOne(c => c.Id == catalogue.Id, entityExist);

                response.Errors = null;
                response.Data = entityExist;
                response.Success = true;
                response.Message = $"Catalogue {bd} updated successfully";

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                response.Errors = null;
                response.Data = null;

                return response;
            }
        }

        private static FilterDefinition<Catalogue> TranslateToMongoFilter(string? sqlQuery)
        {
            if (string.IsNullOrEmpty(sqlQuery))
            {
                return Builders<Catalogue>.Filter.Empty;
            }
            // Dividir la consulta SQL en partes separadas por AND u OR
            var andParts = sqlQuery.Split(separator, StringSplitOptions.RemoveEmptyEntries);

            // Lista para almacenar filtros individuales
            var andFilters = new List<FilterDefinition<Catalogue>>();

            // Procesar cada parte de la consulta
            foreach (var andPart in andParts)
            {
                // Dividir la parte AND en partes separadas por OR
                var orParts = andPart.Split(separatorArray, StringSplitOptions.RemoveEmptyEntries);

                // Lista para almacenar filtros de las partes OR
                var orFilters = new List<FilterDefinition<Catalogue>>();

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

                    andFilters.Add(Builders<Catalogue>.Filter.Or(orFilters));
                }
                else
                {
                    andFilters.Add(Builders<Catalogue>.Filter.And(orFilters));
                }
            }

            // Combinar los filtros AND con un operador AND
            var combinedAndFilter = Builders<Catalogue>.Filter.And(andFilters);

            return combinedAndFilter;
        }

        private static FilterDefinition<Catalogue> TranslateConditionToMongoFilter(string condition)
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

            var filterBuilder = Builders<Catalogue>.Filter;

            FilterDefinition<Catalogue> individualFilter;

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
