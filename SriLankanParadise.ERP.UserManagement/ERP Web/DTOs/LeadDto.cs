namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class LeadDto
    {
        public int LeadId { get; set; }

        public int CustomerId { get; set; }

        public DateTime LeadDate { get; set; }

        public string? Description { get; set; }

        public int ForecastedValue { get; set; }

        public DateTime LeadCreatedDateTime { get; set; }

        public int? LeadCreatedUserId { get; set; }

        public virtual IEnumerable<MeetingDto>? Meetings { get; set; } 
    }
}