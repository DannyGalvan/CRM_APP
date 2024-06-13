
using MongoDB.Bson;

namespace Entities.Request
{
    public class ResetPasswordRequest
    {
        public ObjectId? IdUser { get; set; } = ObjectId.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
