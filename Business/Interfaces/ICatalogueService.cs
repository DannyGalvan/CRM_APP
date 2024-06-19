using Entities.Models;
using Entities.Request;
using Entities.Response;
using FluentValidation.Results;
using MongoDB.Bson;

namespace Business.Interfaces
{
    public interface ICatalogueService
    {
        Response<List<Catalogue>, List<ValidationFailure>> GetAll(string bd, string? filter);
        Response<Catalogue, List<ValidationFailure>> GetById(ObjectId id, string bd);
        Response<Catalogue, List<ValidationFailure>> Create(CatalogueRequest model, string bd);
        Response<Catalogue, List<ValidationFailure>> Update(CatalogueRequest model, string bd);
        Response<Catalogue, List<ValidationFailure>> PartialUpdate(CatalogueRequest model, string bd);
    }
}
