namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class ItemPriceDetailDto
    {
        public int Id { get; set; }
        public int ItemPriceMasterId { get; set; }
        public int ItemMasterId { get; set; }
        public decimal Price { get; set; }

        public ItemMasterDto? ItemMaster { get; set; }
    }
}
