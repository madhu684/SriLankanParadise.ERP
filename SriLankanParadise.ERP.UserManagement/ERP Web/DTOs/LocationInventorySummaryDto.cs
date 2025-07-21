namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class LocationInventorySummaryDto
    {
        public int LocationInventoryId { get; set; }
        public int LocationId { get; set; }
        public int ItemMasterId { get; set; }
        public decimal TotalStockInHand { get; set; }
        public int MinReOrderLevel { get; set; }
        public int MaxStockLevel { get; set; }
        public ItemMasterDto ItemMaster { get; set; }

    }
}
