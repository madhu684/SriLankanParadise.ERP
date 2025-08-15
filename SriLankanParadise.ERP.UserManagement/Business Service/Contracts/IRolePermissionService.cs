using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IRolePermissionService
    {
        Task AddRolePermission(RolePermission rolePermission);
        Task<Dictionary<int, List<RolePermission>>> GetRolePermissionsByRoleIds(int[] roleIds);
        Task DeleteRolePermissionByRoleId(int roleId);
        Task<IEnumerable<RolePermission>> GetRolePermissionsByRoleId(int roleId);
    }
}
