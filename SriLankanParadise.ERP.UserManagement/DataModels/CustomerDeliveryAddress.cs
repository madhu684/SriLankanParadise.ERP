using Newtonsoft.Json;

namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class CustomerDeliveryAddress
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }

        [JsonIgnore]
        public virtual Customer? Customer { get; set; }
    }
}
