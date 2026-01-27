using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CustomerInvoiceDto
    {
        public int SalesInvoiceId { get; set; }
        public string? ReferenceNo { get; set; }
        public string? ReferenceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? AmountDue { get; set; }
        public decimal? DiscountAmount { get; set; }
        public int? Status { get; set; }
        public int? TokenNo { get; set; }
        
        // Customer Details from registered customer
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        
        // Invoiced Person Details (for one-off customers)
        public string? InVoicedPersonName { get; set; }
        public string? InVoicedPersonMobileNo { get; set; }

        public IEnumerable<SalesInvoiceDetailDto> SalesInvoiceDetails { get; set; }
    }
}
