using Entities.Enums;
using Entities.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using Business.Interfaces;
using Entities.Interfaces;
using Humanizer;
using Lombok.NET;

namespace Business.Util
{
    [AllArgsConstructor]
    public partial class RouteVerificationService : IRouteVerification
    {
        private readonly IMongoContext _mongo;
        public bool VerifyStateOrderToDeleteOrUpdateRoute(string routeId)
        {
            string collectionName = nameof(RouteDetail).Pluralize();
            IMongoCollection<RouteDetail> database = _mongo.Database.GetCollection<RouteDetail>(collectionName);

            var aggregate = database.Aggregate();

            var foreignKey = "OrderId";

            var relatedCollectionName = nameof(Order).Pluralize();
            var lookupStage = new BsonDocument("$lookup", new BsonDocument
            {
                { "from", relatedCollectionName },
                { "localField", foreignKey },
                { "foreignField", "_id" },
                { "as", "Order" }
            });
            aggregate = aggregate.AppendStage<RouteDetail>(lookupStage);

            // Flatten the resulting array (MongoDB $lookup returns an array)
            var unwindStage = new BsonDocument("$unwind", new BsonDocument
            {
                { "path", "$Order" },
                { "preserveNullAndEmptyArrays", true }
            });

            aggregate = aggregate.AppendStage<RouteDetail>(unwindStage);

            var filterBuilder = Builders<RouteDetail>.Filter;

            var individualFilter = filterBuilder.Eq(rd => rd.RouteId, ObjectId.Parse(routeId));

            aggregate = aggregate.Match(individualFilter);

            var filterResult = aggregate.ToList();

            if (filterResult.Any(x => x.Order!.OrderStateId.Equals(OrderStatuses.Delivered)))
            {
                return false;
            }

            return true;
        }
    }
}
