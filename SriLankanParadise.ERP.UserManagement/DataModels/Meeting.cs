namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class Meeting
    {
        public int MeetingId { get; set; }

        public int LeadId { get; set; }

        public DateTime MeetingDateTime { get; set; } 

        public string MeetingType { get; set; } = null!;

        public string? Location { get; set; }

        public string? Notes { get; set; }

        public int? MeetingCreatedUserId { get; set; }

        public DateTime MeetingCreatedDateTime { get; set; }

        public virtual Lead Lead { get; set; } = null!;
    }
}