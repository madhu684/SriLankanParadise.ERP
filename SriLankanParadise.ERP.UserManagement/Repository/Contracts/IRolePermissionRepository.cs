using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IRolePermissionRepository
    {
        Task AddRolePermission(RolePermission rolePermission);
        Task<Dictionary<int, List<RolePermission>>> GetRolePermissionsByRoleIds(int[] roleIds);
        Task DeleteRolePermissionByRoleId(int roleId);
        Task<IEnumerable<RolePermission>> GetRolePermissionsByRoleId(int roleId);
    }
}
