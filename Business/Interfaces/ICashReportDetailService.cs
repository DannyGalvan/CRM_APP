using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using MongoDB.Bson;

namespace Business.Interfaces
{
    public interface ICashReportDetailService : IEntityService<CashReportDetail, CashReportDetailRequest, ObjectId>
    {
        public Response<List<CashReportDetail>, List<ValidationFailure>> Bulk(BulkCashReportDetailRequest request);
    }
}
