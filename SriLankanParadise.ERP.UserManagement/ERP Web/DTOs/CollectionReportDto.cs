namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CollectionReportDto
    {
        public List<CollectionReportItemDto> Items { get; set; } = new List<CollectionReportItemDto>();
        public decimal TotalAmount { get; set; }
        public decimal TotalShortAmount { get; set; }
        public decimal TotalExcessAmount { get; set; }
        public decimal TotalCashCollection { get; set; }
        public decimal TotalCashInHand { get; set; }
        public decimal TotalBankTransferAmount { get; set; }
        public decimal TotalGiftVoucherAmount { get; set; }
        public decimal TotalCashierExpenseOutAmount { get; set; }
        public decimal TotalCashInHandAmount { get; set; }

        public decimal DailyTotalAmount { get; set; }
        public decimal DailyTotalShortAmount { get; set; }
        public decimal DailyTotalExcessAmount { get; set; }
        public decimal DailyTotalCashCollection { get; set; }
        public decimal DailyTotalCashInHand { get; set; }
        public decimal DailyTotalBankTransferAmount { get; set; }
        public decimal DailyTotalGiftVoucherAmount { get; set; }
        public decimal DailyTotalCashierExpenseOutAmount { get; set; }
        public decimal DailyTotalCashInHandAmount { get; set; }
    }
}
