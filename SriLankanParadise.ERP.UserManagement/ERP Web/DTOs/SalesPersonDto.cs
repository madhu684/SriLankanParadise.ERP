namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SalesPersonDto
    {
        public int SalesPersonId { get; set; }
        public string SalesPersonCode { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? ContactNo { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
