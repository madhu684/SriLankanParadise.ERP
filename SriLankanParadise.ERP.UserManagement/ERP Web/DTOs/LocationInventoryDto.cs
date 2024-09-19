using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class LocationInventoryDto
    {
        public int LocationInventoryId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public virtual ItemBatchDto? ItemBatch { get; set; }

        public int LocationId { get; set; }

        public decimal? StockInHand { get; set; }
        public string? BatchNo { get; set; }
    }
}
