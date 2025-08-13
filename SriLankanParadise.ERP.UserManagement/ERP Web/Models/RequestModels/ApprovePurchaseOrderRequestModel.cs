namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ApprovePurchaseOrderRequestModel
    {
        public int Status { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? PurchaseRequisitionId { get; set; }

        public int PermissionId { get; set; }
    }
}
