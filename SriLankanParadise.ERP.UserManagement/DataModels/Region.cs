namespace SriLankanParadise.ERP.UserManagement.DataModels
{
    public class Region
    {
        public int RegionId { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string? Alias { get; set; }

        public virtual ICollection<Customer>? Customers { get; set; } = new List<Customer>();
    }
}
