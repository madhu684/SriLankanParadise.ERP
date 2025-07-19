namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class RequisitionMasterDto
    {
        public int RequisitionMasterId { get; set; }

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

        public virtual LocationDto? RequestedFromLocation { get; set; }

        public int? RequestedToLocationId { get; set; }

        public virtual LocationDto? RequestedToLocation { get; set; }

        public virtual IEnumerable<RequisitionDetailDto>? RequisitionDetails { get; set; }

        public string? ReferenceNumber { get; set; }

        public bool IsMINApproved { get; set; }

        public bool IsMINAccepted { get; set; }
    }
}
