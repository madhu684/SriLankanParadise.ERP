using Newtonsoft.Json;

namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class ItemPriceDetail
    {
        public int Id { get; set; }
        public int ItemPriceMasterId { get; set; }
        public int ItemMasterId { get; set; }
        public decimal Price { get; set; }
        public decimal? VATAddedPrice { get; set; }

        [JsonIgnore]
        public virtual ItemPriceMaster? ItemPriceMaster { get; set; }

        //[JsonIgnore]
        public virtual ItemMaster? ItemMaster { get; set; }
    }
}
