using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IRolePermissionRepository
    {
        Task AddRolePermission(RolePermission rolePermission);

        Task<IEnumerable<RolePermission>> GetRolePermissionsByRoleId(int roleId);

        Task<Boolean> IsRolePermissionAlreadyAssigned(int permissionId);

        Task DeleteRolePermission(int roleId, int permissionId);

        Task<Dictionary<int, List<RolePermission>>> GetRolePermissionsByRoleIds(int[] roleIds);
    }
}
