namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class GrnMasterRequestModel
    {
        public int PurchaseOrderId { get; set; }
        public DateTime? GrnDate { get; set; }

        public string? ReceivedBy { get; set; }

        public DateTime? ReceivedDate { get; set; }

        public int? Status { get; set; }


        public int? CompanyId { get; set; }

        public int? ReceivedUserId { get; set; }

        public string? ApprovedBy { get; set; }

        public int? ApprovedUserId { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public int PermissionId { get; set; }
    }
}
