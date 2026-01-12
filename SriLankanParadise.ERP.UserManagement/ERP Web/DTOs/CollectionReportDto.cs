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
    }
}
