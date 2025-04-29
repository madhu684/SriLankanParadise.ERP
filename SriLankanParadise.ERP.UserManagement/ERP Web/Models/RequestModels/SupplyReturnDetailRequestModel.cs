namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SupplyReturnDetailRequestModel
    {
        public int SupplyReturnMasterId { get; set; }
        public int ItemMasterId { get; set; }
        public int BatchId { get; set; }
        public decimal? ReturnedQuantity { get; set; }
        public string? ReferenceNo { get; set; }
        public int LocationId { get; set; }
    }
}
