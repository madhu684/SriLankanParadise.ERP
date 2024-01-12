namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class GrnMasterRequestModel
    {
        public DateTime? GrnDate { get; set; }

        public string? ReceivedBy { get; set; }

        public DateTime? ReceivedDate { get; set; }

        public bool? Status { get; set; }

        public int PermissionId { get; set; }
    }
}
