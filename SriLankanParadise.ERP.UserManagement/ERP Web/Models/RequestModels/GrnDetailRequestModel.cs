namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class GrnDetailRequestModel
    {
        public int GrnMasterId { get; set; }

        public int? ReceivedQuantity { get; set; }

        public int? AcceptedQuantity { get; set; }

        public int? RejectedQuantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? TotalPrice { get; set; }


        public string? ItemId { get; set; }

        public int PermissionId { get; set; }
    }
}
