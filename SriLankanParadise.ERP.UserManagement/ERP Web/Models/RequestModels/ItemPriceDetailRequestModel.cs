namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ItemPriceDetailRequestModel
    {
        public int ItemPriceMasterId { get; set; }
        public int ItemMasterId { get; set; }
        public decimal Price { get; set; }
    }
}
