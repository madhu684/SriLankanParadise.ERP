namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class RoleDto
    {
        public int RoleId { get; set; }

        public string RoleName { get; set; } = null!;

        public int ModuleId { get; set; }

        public virtual ModuleDto? Module { get; set; } = null!;
    }
}
