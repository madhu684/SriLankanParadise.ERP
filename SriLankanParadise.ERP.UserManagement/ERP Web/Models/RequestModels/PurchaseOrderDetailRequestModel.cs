namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class PurchaseOrderDetailRequestModel
    {
        public int PurchaseOrderId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public int? ItemMasterId { get; set; }

        public int PermissionId { get; set; }
    }
}
