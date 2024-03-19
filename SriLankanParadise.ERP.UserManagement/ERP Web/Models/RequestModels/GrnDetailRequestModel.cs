namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class GrnDetailRequestModel
    {
        public int GrnMasterId { get; set; }

        public int? ReceivedQuantity { get; set; }

        public int? AcceptedQuantity { get; set; }

        public int? RejectedQuantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public int? ItemId { get; set; }

        public int? FreeQuantity { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public int PermissionId { get; set; }
    }
}
