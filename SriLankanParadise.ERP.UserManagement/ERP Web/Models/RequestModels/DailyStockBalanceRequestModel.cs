namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class DailyStockBalanceRequestModel
    {
        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }

        public DateTime? Date { get; set; }

        public int? StockInHand { get; set; }

        public int PermissionId { get; set; }
    }
}
