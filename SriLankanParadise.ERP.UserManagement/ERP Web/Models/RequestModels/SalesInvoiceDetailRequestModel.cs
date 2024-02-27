namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SalesInvoiceDetailRequestModel
    {
        public int SalesInvoiceId { get; set; }

        public int? Quantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? TotalPrice { get; set; }

        public int? ItemBatchItemMasterId { get; set; }

        public int? ItemBatchBatchId { get; set; }

        public int PermissionId { get; set; }
    }
}
