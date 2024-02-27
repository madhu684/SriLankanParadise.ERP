namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SalesReceiptDto
    {
        public int SalesReceiptId { get; set; }

        public DateTime? ReceiptDate { get; set; }

        public decimal? AmountReceived { get; set; }

        public string? ReferenceNo { get; set; }

        public int? CompanyId { get; set; }

        public int? PaymentModeId { get; set; }

        public virtual PaymentModeDto? PaymentMode { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public int? Status { get; set; }

        public virtual IEnumerable<SalesReceiptSalesInvoiceDto>? SalesReceiptSalesInvoices { get; set; }
    }
}
