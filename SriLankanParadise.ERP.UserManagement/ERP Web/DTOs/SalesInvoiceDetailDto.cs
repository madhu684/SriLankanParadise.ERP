namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SalesInvoiceDetailDto
    {
        public int SalesInvoiceDetailId { get; set; }

        public int SalesInvoiceId { get; set; }

        public int? Quantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? TotalPrice { get; set; }

        public int? ItemBatchItemMasterId { get; set; }

        public int? ItemBatchBatchId { get; set; }
    }
}
