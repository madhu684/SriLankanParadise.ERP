namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class AgentInfo
    {
        public string StoreName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public AgentOpeningHours OpeningHours { get; set; }
        public string Url { get; set; }
        public string Img { get; set; }
        public string CrmAgencyId { get; set; }
        public string IsMicrositeEnabled { get; set; }
        public string Type { get; set; }
        public string LeadGenerationOptedIn { get; set; }
        public string PseudoCityCode { get; set; }
        public string ProviderUserName { get; set; }
        public string ProviderPassword { get; set; }
        public string PaymentClientId { get; set; }
        public string PaymentApiKey { get; set; }
        public string OTTKey { get; set; }
        public string AgentAbn { get; set; }
        public string TradingName { get; set; }
        public string ProviderName { get; set; }
        public string AgentEncryptedKey { get; set; }
        public string HeaderName { get; set; }
    }

    public class AgentOpeningHours
    {
        public string Friday { get; set; }
        public string Monday { get; set; }
        public string Saturday { get; set; }
        public string Sunday { get; set; }
        public string Thursday { get; set; }
        public string Tuesday { get; set; }
        public string Wednesday { get; set; }
    }
}
