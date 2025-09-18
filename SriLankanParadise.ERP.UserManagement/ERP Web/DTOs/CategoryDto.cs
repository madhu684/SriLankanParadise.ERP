namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }

        public string? CategoryName { get; set; }

        public bool Status { get; set; }

        public int? CompanyId { get; set; }
        public bool IsTreatment { get; set; } = false;
    }
}
