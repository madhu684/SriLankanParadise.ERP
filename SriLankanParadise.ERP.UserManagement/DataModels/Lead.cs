namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class Lead
    {
        public int LeadId { get; set; }

        public int CustomerId { get; set; }

        public DateTime LeadDate { get; set; }

        public string? Description { get; set; }

        public int ForecastedValue { get; set; }

        public DateTime LeadCreatedDateTime { get; set; }

        public int? LeadCreatedUserId { get; set; }

        public virtual Customer Customer { get; set; }

        public virtual ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();
    }
}