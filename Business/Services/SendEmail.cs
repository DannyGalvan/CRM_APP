using Business.Interfaces;
using Entities.Configurations;
using Lombok.NET;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace Business.Services
{
    [AllArgsConstructor]
    public partial class SendEmail : ISendMail
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly ILogger<SendEmail> _logger;

        public bool Send(string correo, string asunto, string mensaje)
        {
            bool resultado;
            try
            {
                AppSettings appSettings = _appSettings.Value;

                MailMessage mail = new();
                mail.To.Add(correo);
                mail.From = new MailAddress(appSettings.Email);
                mail.Subject = asunto;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;

                var smtp = new SmtpClient()
                {
                    Credentials = new NetworkCredential(appSettings.Email, appSettings.Password),
                    Host = appSettings.Host,
                    Port = appSettings.Port,
                    EnableSsl = true,
                };

                smtp.Send(mail);
                resultado = true;

            }
            catch (Exception ex)
            {
                resultado = false;

                _logger.LogError(ex, "Error al enviar correo");
            }

            return resultado;
        }
    }
}
