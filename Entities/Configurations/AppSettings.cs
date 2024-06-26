﻿
namespace Entities.Configurations
{
    public class AppSettings
    {
        public string Secret { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public double TokenExpirationHrs { get; set; }
        public double NotBefore { get; set; }
        public string UrlClient { get; set; } = string.Empty;
    }
}
