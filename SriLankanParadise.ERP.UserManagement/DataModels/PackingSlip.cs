namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class PackingSlip
    {
        public int PackingSlipId { get; set; }

        public int? CustomerId { get; set; }

        public DateTime? PackingSlipDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public int? Status { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? CompanyId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public string? InvoiceReferenceNumber { get; set; }

        public int? LocationId { get; set; }

        public string? ReferenceNo { get; set; }

        public virtual Customer? Customer { get; set; }

        public virtual ICollection<PackingSlipDetail> PackingSlipDetails { get; set; } = new List<PackingSlipDetail>();

    }
}