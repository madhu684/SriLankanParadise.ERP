namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class CustomerRequestModel
    {
        public string? CustomerName { get; set; }

        public string? ContactPerson { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public int CompanyId { get; set; }

        public int PermissionId { get; set; }
    }
}
