namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class DailyStockBalanceDto
    {
        public int DailyStockBalanceId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }

        public DateTime? Date { get; set; }

        public int? StockInHand { get; set; }
    }
}
