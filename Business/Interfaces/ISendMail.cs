
namespace Business.Interfaces
{
    public interface ISendMail
    {
        public bool Send(string correo, string asunto, string mensaje);
    }
}
