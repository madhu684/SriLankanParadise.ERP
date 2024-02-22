namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SalesReceiptSalesInvoiceRequestModel
    {
        public int? SalesReceiptId { get; set; }

        public int? SalesInvoiceId { get; set; }

        public decimal? SettledAmount { get; set; }

        public int PermissionId { get; set; }
    }
}
