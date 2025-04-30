namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class DailyLocationInventoryLog
    {
        public int Id { get; set; }
        public int DailyLocationInventoryId { get; set; }
        public DateTime EnteredDate { get; set; }
        public int EnteredUserId { get; set; }
        public decimal? Qty { get; set; }
        public string? Remark { get; set; }

        public virtual DailyLocationInventory DailyLocationInventory { get; set; }
    }
}
