using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IRolePermissionService
    {
        Task AddRolePermission(RolePermission rolePermission);
    }
}
