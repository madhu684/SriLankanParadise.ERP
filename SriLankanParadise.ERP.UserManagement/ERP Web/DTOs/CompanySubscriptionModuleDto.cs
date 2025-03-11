namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CompanySubscriptionModuleDto
    {
        public int CompanySubscriptionModuleId { get; set; }

        public int SubscriptionModuleId { get; set; }

        public int CompanyId { get; set; }

        public int UserCount { get; set; }

        public decimal Price { get; set; }

        public int? AddedUserCount { get; set; }

        public CompanyDto Company { get; set; } = null!;

        public ICollection<CompanySubscriptionModuleUserDto> CompanySubscriptionModuleUsers { get; set; }

        public SubscriptionModuleDto SubscriptionModule { get; set; } = null!;
    }
}
