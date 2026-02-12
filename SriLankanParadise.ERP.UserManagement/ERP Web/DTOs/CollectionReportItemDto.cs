namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CollectionReportItemDto
    {
        public DateTime? Date { get; set; }
        public string? BillNo { get; set; }
        public string? InvoiceReference { get; set; }
        public int? ChannelNo { get; set; }
        public string? PatientName { get; set; }
        public int? TokenNumber { get; set; }
        public decimal? Amount { get; set; }
        public decimal? ShortAmount { get; set; }
        public decimal? ExcessAmount { get; set; }
        public string? TelephoneNo { get; set; }
        public string? User { get; set; }
        public DateTime? EnteredTime { get; set; }
        public string? ModeOfPayment { get; set; }
    }
}
