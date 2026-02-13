namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ApproveIssueMasterRequestModel
    {
        public int Status { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public DateTime? AcceptedDate { get; set; }

        public int PermissionId { get; set; }
    }
}
