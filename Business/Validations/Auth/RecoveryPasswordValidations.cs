using Entidades.Request;
using Entities.Interfaces;
using Entities.Models;
using FluentValidation;
using Humanizer;
using MongoDB.Driver;

namespace Business.Validations.Auth
{
    public class RecoveryPasswordValidations : AbstractValidator<RecoveryPasswordRequest>
    {
        private readonly ICRMContext _bd;
        public RecoveryPasswordValidations(ICRMContext bd)
        {
            _bd = bd;

            RuleFor(r => r.Email)
                .NotEmpty()
                .WithMessage("El correo es obligatorio")
                .EmailAddress()
                .WithMessage("El correo es invalido")
                .Must(e => UserEmailExists(e))
                .WithMessage("El correo no existe");

        }

        private bool UserEmailExists(string email)
        {
            string nameCollection = typeof(User).Name.Pluralize();

            IMongoCollection<User> Users = _bd.Database.GetCollection<User>(nameCollection);

            return Users.Find(u => u.Email == email).FirstOrDefault() != null;
        }
    }
}
