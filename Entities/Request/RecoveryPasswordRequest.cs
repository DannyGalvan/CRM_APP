using System.ComponentModel.DataAnnotations;

namespace Entidades.Request
{
    public class RecoveryPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}
