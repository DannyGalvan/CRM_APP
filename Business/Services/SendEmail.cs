using Business.Interfaces;
using Entities.Configurations;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace Business.Repository
{
    public class SendEmail(IOptions<AppSettings> appSettings) : ISendMail
    {
        private readonly AppSettings _appSettings = appSettings.Value;

        public bool Send(string correo, string asunto, string mensaje)
        {
            bool resultado;
            try
            {
                MailMessage mail = new();
                mail.To.Add(correo);
                mail.From = new MailAddress(_appSettings.Email);
                mail.Subject = asunto;
                mail.Body = mensaje;
                mail.IsBodyHtml = true;

                var smtp = new SmtpClient()
                {
                    Credentials = new NetworkCredential(_appSettings.Email, _appSettings.Password),
                    Host = _appSettings.Host,
                    Port = _appSettings.Port,
                    EnableSsl = true,
                };

                smtp.Send(mail);
                resultado = true;

            }
            catch (Exception)
            {
                resultado = false;
            }

            return resultado;
        }
    }
}
