using Entities.Request;
using FluentValidation;
using BC = BCrypt.Net;
using MongoDB.Bson;
using Entities.Models;
using MongoDB.Driver;
using Humanizer;
using Entities.Interfaces;

namespace Business.Validations.Auth
{
    public class ResetPasswordValidations : AbstractValidator<ResetPasswordRequest>
    {
        private readonly ICRMContext _bd;
        public ResetPasswordValidations(ICRMContext bd)
        {
            _bd = bd;

            RuleFor(u => u.IdUser)
               .NotEmpty()
               .WithMessage("Debes proporcionar el Id del usuario")
               .Must(UserExists)
               .WithMessage("El usuario no existe");
            RuleFor(u => u.Password)
                .NotEmpty()
                .WithMessage("Debes proporcionar una contraseña")
                .MinimumLength(8)
                .WithMessage("La contraseña debe contener al menos 8 caracteres")
                .Matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,25}$")
                .WithMessage("La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial, y tener entre 8 y 25 caracteres");
            RuleFor(u => u.ConfirmPassword)
                .NotEmpty()
                .WithMessage("Debes confirmar la contraseña")
                .Equal(u => u.Password)
                .WithMessage("La confirmación de la contraseña debe coincidir con la contraseña");
            RuleFor(x => x).Custom((model, context) =>
            {
                string nameCollection = nameof(User).Pluralize();

                IMongoCollection<User> users = _bd.Database.GetCollection<User>(nameCollection);

                ObjectId id = ObjectId.Parse(model.IdUser);

                User? user = users.Find(x => x.Id.Equals(id)).FirstOrDefault();

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

        private bool UserExists(string id)
        {
            string nameCollection = nameof(User).Pluralize();

            IMongoCollection<User> users = _bd.Database.GetCollection<User>(nameCollection);

            ObjectId id1 = ObjectId.Parse(id);

            return users.Find(u => u.Id == id1).FirstOrDefault() != null;
        }

    }
}
