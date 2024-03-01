namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class RequisitionMasterRequestModel
    {
        public int? RequestedUserId { get; set; }

        public string? RequestedBy { get; set; }

        public DateTime? RequisitionDate { get; set; }

        public string? PurposeOfRequest { get; set; }

        public int? Status { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? CompanyId { get; set; }

        public string? RequisitionType { get; set; }

        public int? RequestedFromLocationId { get; set; }

        public int? RequestedToLocationId { get; set; }

        public int PermissionId { get; set; }
    }
}
