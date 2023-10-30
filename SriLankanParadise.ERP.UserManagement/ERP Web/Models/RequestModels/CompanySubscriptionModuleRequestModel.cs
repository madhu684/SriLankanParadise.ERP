namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class CompanySubscriptionModuleRequestModel
    {
        public int SubscriptionModuleId { get; set; }

        public int CompanyId { get; set; }

        public int UserCount { get; set; }

        public decimal Price { get; set; }

        public int? AddedUserCount { get; set; }
        public int PermissionId { get; set; }
    }
}
