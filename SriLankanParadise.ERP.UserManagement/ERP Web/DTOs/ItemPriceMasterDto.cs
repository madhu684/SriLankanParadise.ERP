namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class ItemPriceMasterDto
    {
        public int Id { get; set; }
        public string ListName { get; set; }
        public int Status { get; set; }
        public DateTime EffectiveDate { get; set; }
        public int CompanyId { get; set; }
        public string CreatedBy { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<ItemPriceDetailDto>? ItemPriceDetails { get; set; }
    }
}
