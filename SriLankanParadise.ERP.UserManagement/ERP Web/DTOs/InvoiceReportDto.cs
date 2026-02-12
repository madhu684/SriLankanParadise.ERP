namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class InvoiceReportDto
    {
        public int SalesInvoiceId { get; set; }
        public string? InvoiceNo { get; set; }
        public string? CustomerName { get; set; }
        public int? TokenNumber {  get; set; }
        public int? InvoiceStatus { get; set; }
        public decimal? InvoiceAmount { get; set; }
        
        // Receipt Details
        public string? ReceiptNumber { get; set; }
        public decimal? ReceiptAmount { get; set; }
        public string? PaymentMode { get; set; }
        public int? ReceiptStatus { get; set; }
        public DateTime? ReceiptDate { get; set; }
        public decimal? ExcessAmount { get; set; }
        public decimal? DueAmount { get; set; }
    }
}
