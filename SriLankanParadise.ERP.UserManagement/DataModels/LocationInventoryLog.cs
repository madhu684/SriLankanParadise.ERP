namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class LocationInventoryLog
    {
        public int Id { get; set; }
        public int LocationInventoryId { get; set; }
        public int LocationId { get; set; }
        public int ItemMasterId { get; set; }
        public decimal? InitialQuantity { get; set; }
        public decimal? ChangedQuantity { get; set; }
        public string? Type { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
