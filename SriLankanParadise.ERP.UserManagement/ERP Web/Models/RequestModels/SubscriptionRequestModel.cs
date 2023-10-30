namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SubscriptionRequestModel
    {
        public string? PlanName { get; set; }

        public decimal? Price { get; set; }

        public string? Description { get; set; }

        public int? Duration { get; set; }
        public int PermissionId { get; set; }
    }
}
