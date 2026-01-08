namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SalesInvoiceRequestModel
    {
        public DateTime? InvoiceDate { get; set; }

        public DateTime? DueDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public int? Status { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? CompanyId { get; set; }

        public int? SalesOrderId { get; set; }

        public decimal? AmountDue { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public string? ReferenceNumber { get; set; }

        public int PermissionId { get; set; }

        public int? LocationId { get; set; }

        public string? InVoicedPersonName { get; set; }

        public string? InVoicedPersonMobileNo { get; set; }

        public int? AppointmentId { get; set; }

        public int? TokenNo { get; set; }

        public decimal? DiscountAmount { get; set; }
    }
}
