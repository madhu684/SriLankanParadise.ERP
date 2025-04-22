namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class LeadRequestModel
    {
        public int CustomerId { get; set; }

        public DateTime LeadDate { get; set; }

        public string? Description { get; set; }
        public int ForecastedValue { get; set; }

        public DateTime LeadCreatedDateTime { get; set; }

        public int? LeadCreatedUserId { get; set; }
    }
}