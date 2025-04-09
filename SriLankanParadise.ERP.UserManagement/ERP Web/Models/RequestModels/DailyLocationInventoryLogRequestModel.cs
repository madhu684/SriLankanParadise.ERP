namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class DailyLocationInventoryLogRequestModel
    {
        public DailyLocationInventoryRequestModel DailyLocationInventory { get; set; }
        public int EnteredUserId { get; set; }
        public string? Remark { get; set; }
    }
}
