using Users = Entities.Models.User;
using Entities.Request;
using FluentValidation;
using BC = BCrypt.Net;
using Entities.Context;
using MongoDB.Bson;
using Entities.Models;
using MongoDB.Driver;
using Humanizer;

namespace Business.Validations.Auth
{
    public class ResetPasswordValidations : AbstractValidator<ResetPasswordRequest>
    {
        private readonly CRMContext _bd;
        public ResetPasswordValidations(CRMContext bd)
        {
            _bd = bd;

            RuleFor(u => u.IdUser)
               .NotEmpty()
               .WithMessage("Debes proporcionar el Id del usuario")
               .Must(u => UserExists(u!.Value))
               .WithMessage("El usuario no existe");
            RuleFor(u => u.Password)
                .NotEmpty()
                .WithMessage("Debes proporcionar una contraseña")
                .MinimumLength(8)
                .WithMessage("La contraseña debe contener al menos 8 caracteres")
                .Matches("^(?=.*[A-Z])(?=.*\\d).+$")
                .WithMessage("La contraseña debe contener al menos una letra mayúscula un número");
            RuleFor(u => u.ConfirmPassword)
                .NotEmpty()
                .WithMessage("Debes confirmar la contraseña")
                .Equal(u => u.Password)
                .WithMessage("La confirmación de la contraseña debe coincidir con la contraseña");
            RuleFor(x => x).Custom((model, context) =>
            {
                string nameCollection = typeof(User).Name.Pluralize();

                IMongoCollection<User> Users = _bd.Database.GetCollection<User>(nameCollection);

                Users? user = Users.Find(x => x.Id.Equals(model.IdUser!.Value)).FirstOrDefault();

                if (user != null)
                {
                    if (BC.BCrypt.Verify(model.Password, user.Password))
                    {
                        context.AddFailure("Password", $"La contraseña Actual no puede ser igual a la anterior");
                    }

                }
                else
                {
                    context.AddFailure("El usuario no existe");
                }
            });
        }

        private bool UserExists(ObjectId id)
        {
            string nameCollection = typeof(User).Name.Pluralize();

            IMongoCollection<User> Users = _bd.Database.GetCollection<User>(nameCollection);

            return Users.Find(u => u.Id == id).FirstOrDefault() != null;
        }

    }
}
