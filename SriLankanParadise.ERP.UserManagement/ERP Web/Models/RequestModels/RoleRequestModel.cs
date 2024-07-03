namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class RoleRequestModel
    {
        public string? RoleName { get; set; }

        public int ModuleId { get; set; }

        public int? CompanyId { get; set; }

        public bool? Status { get; set; }

        public int PermissionId { get; set; }
    }
}
