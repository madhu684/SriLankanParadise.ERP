namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SalesReceiptRequestModel
    {
        public DateTime? ReceiptDate { get; set; }

        public decimal? AmountReceived { get; set; }

        public string? ReferenceNo { get; set; }

        public int? CompanyId { get; set; }

        public int? PaymentModeId { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public int? Status { get; set; }

        public int PermissionId { get; set; }
    }
}
