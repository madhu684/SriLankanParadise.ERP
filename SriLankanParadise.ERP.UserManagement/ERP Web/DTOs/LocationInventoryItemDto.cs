namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class LocationInventoryItemDto
    {
        public int LocationInventoryId { get; set; }

        public int ItemMasterId { get; set; }

        public string ItemName { get; set; }

        public string ItemCode { get; set; }

        public int UnitId { get; set; }

        public string UnitName { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }

        public decimal? StockInHand { get; set; }
        public string? BatchNo { get; set; }
    }
}
