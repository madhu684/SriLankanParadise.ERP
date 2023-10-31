namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CompanySubscriptionModuleDto
    {
        public int SubscriptionModuleId { get; set; }

        public int CompanyId { get; set; }

        public int UserCount { get; set; }

        public decimal Price { get; set; }

        public int? AddedUserCount { get; set; }
    }
}
