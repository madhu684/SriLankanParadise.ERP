namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SalesOrderDto
    {
        public int SalesOrderId { get; set; }

        public int? CustomerId { get; set; }

        public virtual CustomerDto? Customer { get; set; }

        public DateTime? OrderDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public int? Status { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? CompanyId { get; set; }

        public string? ReferenceNo { get; set; }

        public virtual IEnumerable<SalesOrderDetailDto>? SalesOrderDetails { get; set; }
    }
}
