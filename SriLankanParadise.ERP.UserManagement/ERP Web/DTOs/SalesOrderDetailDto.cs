using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SalesOrderDetailDto
    {
        public int SalesOrderDetailId { get; set; }

        public int ItemBatchItemMasterId { get; set; }

        public int ItemBatchBatchId { get; set; }

        public int SalesOrderId { get; set; }

        public int? Quantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? TotalPrice { get; set; }

        public virtual ItemBatchDto? ItemBatch { get; set; }
    }
}
