namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class SupplierRequestModel
    {
        public int CompanyId { get; set; }

        public string SupplierName { get; set; } = null!;

        public string ContactPerson { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public string Email { get; set; } = null!;

        public int PermissionId { get; set; }
    }
}
