using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SalesInvoiceDto
    {
        public int SalesInvoiceId { get; set; }

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

        public string? ReferenceNo { get; set; }

        public decimal? AmountDue { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public string? ReferenceNumber { get; set; }

        public int? LocationId { get; set; }

        public int? CustomerId { get; set; }

        public int? CustomerDeliveryAddressId { get; set; }

        public string? DriverName { get; set; }

        public string? VehicleNumber { get; set; }

        public decimal? TotalLitres { get; set; }

        public virtual SalesOrderDto? SalesOrder { get; set; }
        public virtual CustomerDto? Customer { get; set; }

        public virtual IEnumerable<SalesInvoiceDetailDto>? SalesInvoiceDetails { get; set; }
    }
}
