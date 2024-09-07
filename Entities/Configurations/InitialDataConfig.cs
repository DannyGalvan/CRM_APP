namespace Entities.Configurations
{
    public class InitialDataConfig
    {
        public string EmailManager { get; set; } = string.Empty;
        public string PasswordManager { get; set; } = string.Empty;
        public string IdManager { get; set; } = string.Empty;
        public string NameManager { get; set; } = string.Empty;
        public string LastNameManager { get; set; } = string.Empty; 
        public string UserNameManager { get; set; } = string.Empty;
        public string NumberManager { get; set; } = string.Empty;
        public bool ActiveManager { get; set; }
        public bool ConfirmManager { get; set; }
        public string DatabaseManager { get; set; } = string.Empty;
        public string ConnectionStringManager { get; set; } = string.Empty; 
    }
}
