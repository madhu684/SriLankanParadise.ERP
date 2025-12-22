namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class SalesCustomer
    {
        public int SalesCustomerId { get; set; }
        public string SalesCustomerCode { get; set; }
        public string SalesCustomerName { get; set; }
        public string ContactPerson { get; set; }
        public string ContactNo { get; set; }
        public string Email { get; set; }
        public int Status { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public int CompanyId { get; set; }

        public virtual ICollection<SalesOrder> SalesOrders { get; set; } = new List<SalesOrder>();
    }
}
