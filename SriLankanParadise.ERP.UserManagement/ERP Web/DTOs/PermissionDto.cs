namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PermissionDto
    {
        public int PermissionId { get; set; }

        public string PermissionName { get; set; } = null!;

        public bool PermissionStatus { get; set; }

        public int ModuleId { get; set; }

        public virtual ModuleDto? Module { get; set; } = null!;
    }
}
