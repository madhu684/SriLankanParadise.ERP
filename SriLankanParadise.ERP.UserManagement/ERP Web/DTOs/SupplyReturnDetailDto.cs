namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SupplyReturnDetailDto
    {
        public int SupplyReturnDetailId { get; set; }
        public int SupplyReturnMasterId { get; set; }
        public int ItemMasterId { get; set; }
        public int BatchId { get; set; }
        public decimal? ReturnedQuantity { get; set; }
        public string? ReferenceNo { get; set; }
        public ItemMasterDto? ItemMaster { get; set; }
        public BatchDto? Batch { get; set; }
    }
}
