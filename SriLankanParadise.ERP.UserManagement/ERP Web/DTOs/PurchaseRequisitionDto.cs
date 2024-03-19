namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PurchaseRequisitionDto
    {
        public int PurchaseRequisitionId { get; set; }

        public string RequestedBy { get; set; } = null!;

        public int? RequestedUserId { get; set; }

        public string Department { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string ContactNo { get; set; } = null!;

        public DateTime RequisitionDate { get; set; }

        public string PurposeOfRequest { get; set; } = null!;
        public DateTime ExpectedDeliveryDate { get; set; }

        public int ExpectedDeliveryLocation { get; set; }

        public virtual LocationDto? ExpectedDeliveryLocationNavigation { get; set; }

        public string? ReferenceNo { get; set; }

        public decimal TotalAmount { get; set; }

        public int Status { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? CompanyId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public virtual IEnumerable<PurchaseRequisitionDetailDto>? PurchaseRequisitionDetails { get; set;}
    }
}
