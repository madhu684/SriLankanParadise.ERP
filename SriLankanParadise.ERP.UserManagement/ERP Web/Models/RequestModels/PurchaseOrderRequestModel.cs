namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class PurchaseOrderRequestModel
    {
        public int GrnMasterId { get; set; }

        public int SupplierId { get; set; }

        public DateTime? OrderDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public bool? Status { get; set; }

        public string? Remark { get; set; }

        public int PermissionId { get; set; }
    }
}
