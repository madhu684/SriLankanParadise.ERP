using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class InvoiceReportResponseDto
    {
        public IEnumerable<InvoiceReportDto> Items { get; set; }
        public decimal TotalInvoiceAmount { get; set; }
        public decimal TotalReceiptAmount { get; set; }
        public decimal TotalExcessAmount { get; set; }
        public decimal TotalOutstandingAmount { get; set; }
        public int TotalInvoiceCount { get; set; }
    }
}
