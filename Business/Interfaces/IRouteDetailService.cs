
using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation;
using FluentValidation.Results;
using MongoDB.Bson;

namespace Business.Interfaces
{
    public interface IRouteDetailService : IEntityService<RouteDetail, RouteDetailRequest, ObjectId>
    {
        public Response<List<RouteDetail>, List<ValidationFailure>> Bulk(BulkRouteDetailRequest request);
    }
}
