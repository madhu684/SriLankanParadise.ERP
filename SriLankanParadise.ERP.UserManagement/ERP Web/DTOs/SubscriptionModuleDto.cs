namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SubscriptionModuleDto
    {
        public int SubscriptionModuleId { get; set; }

        public int ModuleId { get; set; }

        public int SubscriptionId { get; set; }

        public decimal? ModulePricePerPlan { get; set; }

        public int? MaxUserCount { get; set; }

        public bool Status { get; set; }

        public ICollection<CompanySubscriptionModuleDto> CompanySubscriptionModules { get; set; }

        public ModuleDto Module { get; set; } = null!;

        public SubscriptionDto Subscription { get; set; } = null!;
    }
}
