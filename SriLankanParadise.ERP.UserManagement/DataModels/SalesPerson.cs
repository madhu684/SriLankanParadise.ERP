namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class SalesPerson
    {
        public int SalesPersonId { get; set; }
        public string SalesPersonCode { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? ContactNo { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }

        public virtual ICollection<Customer>? Customers { get; set; } = new List<Customer>();
    }
}
