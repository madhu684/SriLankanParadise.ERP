using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PackingSlipDto
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

        public virtual CustomerDto? Customer { get; set; }

        public virtual IEnumerable<PackingSlipDetailDto> PackingSlipDetails { get; set; }
    }
}
