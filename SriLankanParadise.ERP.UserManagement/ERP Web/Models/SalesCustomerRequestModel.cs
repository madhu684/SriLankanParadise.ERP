namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models
{
    public class SalesCustomerRequestModel
    {
        public string SalesCustomerCode { get; set; }
        public string SalesCustomerName { get; set; }
        public string ContactPerson { get; set; }
        public string ContactNo { get; set; }
        public string Email { get; set; }
        public int Status { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public int CompanyId { get; set; }
    }
}
