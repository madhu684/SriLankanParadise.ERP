using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IRolePermissionRepository
    {
        Task AddRolePermission(RolePermission rolePermission);
    }
}
