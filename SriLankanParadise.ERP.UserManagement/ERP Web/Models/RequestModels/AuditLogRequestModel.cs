namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class AuditLogRequestModel
    {
        public int UserId { get; set; }

        public Guid SessionId { get; set; }

        public string AccessedPath { get; set; } = null!;

        public string AccessedMethod { get; set; } = null!;

        public DateTime Timestamp { get; set; }

        public string Ipaddress { get; set; } = null!;
        public string? Description { get; set; }
    }
}
