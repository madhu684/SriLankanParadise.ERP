namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SubscriptionDto
    {

        public int SubscriptionId { get; set; }

        public string? PlanName { get; set; }

        public decimal? Price { get; set; }

        public string? Description { get; set; }

        public int? Duration { get; set; }
    }
}
