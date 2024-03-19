namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PurchaseOrderDetailDto
    {
        public int PurchaseOrderDetailId { get; set; }

        public int PurchaseOrderId { get; set; }

        public int? ItemMasterId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public virtual ItemMasterDto? ItemMaster { get; set; }
    }
}
