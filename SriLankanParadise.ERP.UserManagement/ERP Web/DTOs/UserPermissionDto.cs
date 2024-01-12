using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class UserPermissionDto
    {
        public int UserId { get; set; }

        public int PermissionId { get; set; }

        public virtual PermissionDto? Permission { get; set; }
    }
}
