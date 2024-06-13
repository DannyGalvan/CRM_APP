using Entities.Context;
using Entities.Models;
using Entities.Request;
using FluentValidation;
using Humanizer;
using MongoDB.Driver;

namespace Business.Validations.Auth
{
    public class LoginValidations : AbstractValidator<LoginRequest>
    {
        private readonly CRMContext _bd;
        public LoginValidations(CRMContext bd)
        {
            _bd = bd;

            RuleFor(l => l.Password)
                .NotEmpty()
                .WithMessage("Usuario y/o contraseña invalidos")
                .OverridePropertyName("UserName");

            RuleFor(l => l.UserName)
                .NotEmpty()
                .OverridePropertyName("Password")
                .WithMessage("Usuario y/o contraseña invalidos")
                .Must(UserNameExists)  
                .OverridePropertyName("Password")
                .WithMessage("Usuario y/o contraseña invalidos");
        }

        private bool UserNameExists(string userName)
        {
            string nameCollection = typeof(User).Name.Pluralize();

            IMongoCollection<User> Users = _bd.Database.GetCollection<User>(nameCollection);

            return Users.Find(u => u.UserName == userName).FirstOrDefault() != null;
        }
    }


}
