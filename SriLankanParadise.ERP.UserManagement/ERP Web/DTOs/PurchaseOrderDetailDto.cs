namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PurchaseOrderDetailDto
    {
        public int PurchaseOrderDetailId { get; set; }

        public int PurchaseOrderId { get; set; }

        public string ItemCategory { get; set; } = null!;

        public string ItemId { get; set; } = null!;

        public string Name { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }
    }
}
