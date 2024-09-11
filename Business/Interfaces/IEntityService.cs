using Entities.Response;
using FluentValidation;
using FluentValidation.Results;

namespace Business.Interfaces
{
    public interface IEntityService<TEntity, TRequest, TId>
    {
        Response<List<TEntity>, List<ValidationFailure>> GetAll(string? filters, bool? thenInclude = false);
        Response<TEntity, List<ValidationFailure>> GetById(TId id);
        Response<TEntity, List<ValidationFailure>> Create(TRequest model);
        Response<TEntity, List<ValidationFailure>> Update(TRequest model);
        Response<TEntity, List<ValidationFailure>> PartialUpdate(TRequest model);
    }
}
