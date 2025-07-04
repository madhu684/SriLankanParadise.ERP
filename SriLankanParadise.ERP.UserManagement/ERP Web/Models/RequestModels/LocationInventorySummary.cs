using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class LocationInventorySummary
    {
        public int LocationInventoryId { get; set; }
        public int LocationId { get; set; }
        public int ItemMasterId { get; set; }
        public decimal TotalStockInHand { get; set; }
        public int MinReOrderLevel { get; set; }
        public int MaxStockLevel { get; set; }
        public ItemMaster ItemMaster { get; set; }
    }
}
