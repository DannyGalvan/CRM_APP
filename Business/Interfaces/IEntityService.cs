using Entities.Response;
using FluentValidation;
using FluentValidation.Results;

namespace Business.Interfaces
{
    public interface IEntityService<TEntity, TRequest, TId>
    {
        Response<List<TEntity>, List<ValidationFailure>> GetAll(string? filters);
        Response<TEntity, List<ValidationFailure>> GetById(TId id);
        Response<TEntity, List<ValidationFailure>> Create(TRequest model, AbstractValidator<TRequest> validator);
        Response<TEntity, List<ValidationFailure>> Update(TRequest model, AbstractValidator<TRequest> validator);
        Response<TEntity, List<ValidationFailure>> PartialUpdate(TRequest model, AbstractValidator<TRequest> validator);
    }
}
