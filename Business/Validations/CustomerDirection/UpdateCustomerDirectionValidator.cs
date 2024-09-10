﻿
using Entities.Request;
using FluentValidation;
using MongoDB.Bson;

namespace Business.Validations.CustomerDirection
{
    public class UpdateCustomerDirectionValidator : AbstractValidator<CustomerDirectionRequest>
    {
        public UpdateCustomerDirectionValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("El campo Id es requerido")
                .Must(HasValidId).WithMessage("El Id no tiene un formato valido");
            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("El campo Dirección es requerido");
            RuleFor(x => x.DepartmentId)
                .NotEmpty().WithMessage("El campo Departamento es requerido")
                .Must(HasValidId).WithMessage("El Departamento no tiene un id valido");
            RuleFor(x => x.MunicipalityId)
                .NotEmpty().WithMessage("El campo Municipio es requerido")
                .Must(HasValidId).WithMessage("El Municipio no tiene una id valido");
            RuleFor(x => x.ZoneId)
                .NotEmpty().WithMessage("El campo Zona es requerido")
                .Must(HasValidId).WithMessage("La Zona no tiene un id valido");
            RuleFor(x => x.ColonyCondominium)
                .NotEmpty().WithMessage("El campo Colonia/Condominio es requerido");
            RuleFor(x => x.CustomerId)
                .NotEmpty().WithMessage("El campo Cliente es requerido")
                .Must(HasValidId).WithMessage("El Cliente no tiene una id valido");
            RuleFor(x => x.CreatedBy)
                .Null().WithMessage("El Usuario creador no puede ser modificado");
            RuleFor(x => x.UpdatedBy)
                .NotEmpty().WithMessage("El Usuario creador es requerido")
                .Must(HasValidId).WithMessage("El Usuario creador no es valido");
        }

        private bool HasValidId(string? id)
        {
            return ObjectId.TryParse(id, out _);
        }
    }
}