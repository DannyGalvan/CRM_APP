﻿using Entities.Response;
using FluentValidation.Results;

namespace Business.Interfaces.Interceptors
{
    public interface IEntityAfterCreateInterceptor<T, in TRequest>
    {
        Response<T, List<ValidationFailure>> Execute(Response<T, List<ValidationFailure>> response, TRequest request);
    }
}