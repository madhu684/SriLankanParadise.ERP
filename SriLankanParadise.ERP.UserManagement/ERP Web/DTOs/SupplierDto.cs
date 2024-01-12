namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SupplierDto
    {
        public int SupplierId { get; set; }

        public int CompanyId { get; set; }

        public string SupplierName { get; set; } = null!;

        public string ContactPerson { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public string Email { get; set; } = null!;
    }
}
