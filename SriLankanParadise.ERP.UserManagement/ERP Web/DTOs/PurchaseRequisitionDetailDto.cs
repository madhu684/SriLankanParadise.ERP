namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PurchaseRequisitionDetailDto
    {
        public int PurchaseRequisitionDetailId { get; set; }

        public int PurchaseRequisitionId { get; set; }

        public string ItemCategory { get; set; } = null!;

        public string ItemId { get; set; } = null!;

        public string Name { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }
    }
}
