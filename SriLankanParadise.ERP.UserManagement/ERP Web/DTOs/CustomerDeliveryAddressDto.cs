namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CustomerDeliveryAddressDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
    }
}
