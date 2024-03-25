namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SalesReceiptRequestModel
    {
        public DateTime? ReceiptDate { get; set; }

        public decimal? AmountReceived { get; set; }

        public string? PaymentReferenceNo { get; set; }

        public int? CompanyId { get; set; }

        public int? PaymentModeId { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public int? Status { get; set; }

        public decimal? ExcessAmount { get; set; }

        public decimal? ShortAmount { get; set; }

        public decimal? TotalAmount { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public string? ReferenceNumber { get; set; }

        public int PermissionId { get; set; }
    }
}
