namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class MeetingDto
    {
        public int MeetingId { get; set; }

        public int LeadId { get; set; }

        public DateTime MeetingDateTime { get; set; }

        public string MeetingType { get; set; } = null!;

        public string? Location { get; set; }

        public string? Notes { get; set; }

        public int? MeetingCreatedUserId { get; set; }

        public DateTime MeetingCreatedDateTime { get; set; }
    }
}