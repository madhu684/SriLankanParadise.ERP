namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class IssueMasterRequestModel
    {
        public int? RequisitionMasterId { get; set; }

        public DateTime? IssueDate { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public int? Status { get; set; }

        public string? ApprovedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? CompanyId { get; set; }

        public string? IssueType { get; set; }

        public string? ReferenceNumber { get; set; }

        public int? ApprovedUserId { get; set; }

        public int? IssuedLocationId { get; set; }

        public string? TokenNo { get; set; }

        public int PermissionId { get; set; }
    }
}
