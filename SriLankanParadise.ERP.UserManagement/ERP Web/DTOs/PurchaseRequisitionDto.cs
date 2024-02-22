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

        public DateTime DeliveryDate { get; set; }

        public int DeliveryLocation { get; set; }

        public virtual LocationDto? DeliveryLocationNavigation { get; set; }

        public string? ReferenceNo { get; set; }

        public decimal TotalAmount { get; set; }

        public int Status { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? CompanyId { get; set; }

        public virtual IEnumerable<PurchaseRequisitionDetailDto>? PurchaseRequisitionDetails { get; set;}
    }
}
