namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class PurchaseOrderRequestModel
    {

        public int SupplierId { get; set; }

        public DateTime? OrderDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public int? Status { get; set; }

        public string? Remark { get; set; }

        public string? OrderedBy { get; set; }

        public string? ApprovedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? OrderedUserId { get; set; }

        public int? ApprovedUserId { get; set; }

        public int? CompanyId { get; set; }

        public int PermissionId { get; set; }
    }
}
