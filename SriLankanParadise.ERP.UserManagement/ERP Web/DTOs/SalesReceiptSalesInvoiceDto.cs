using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SalesReceiptSalesInvoiceDto
    {
        public int SalesReceiptSalesInvoiceId { get; set; }

        public int? SalesReceiptId { get; set; }

        public int? SalesInvoiceId { get; set; }

        public decimal? SettledAmount { get; set; }

        public virtual SalesInvoiceDto? SalesInvoice { get; set; }
    }
}
