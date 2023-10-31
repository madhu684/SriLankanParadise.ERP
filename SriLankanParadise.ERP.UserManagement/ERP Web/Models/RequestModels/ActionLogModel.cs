namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ActionLogModel
    {
        public int UserId { get; set; }
        public int ActionId { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Ipaddress { get; set; }
    }
}
