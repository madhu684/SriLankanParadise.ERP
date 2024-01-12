namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PurchaseOrderDto
    {
        public int PurchaseOrderId { get; set; }

        public int GrnMasterId { get; set; }

        public int SupplierId { get; set; }

        public DateTime? OrderDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public bool? Status { get; set; }

        public string? Remark { get; set; }

        public virtual IEnumerable<PurchaseOrderDetailDto>? PurchaseOrderDetails { get; set; }
    }
}
