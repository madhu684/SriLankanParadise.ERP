using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly IRolePermissionRepository _rolePermissionRepository;
        public RolePermissionService(IRolePermissionRepository rolePermissionRepository)
        {
            _rolePermissionRepository = rolePermissionRepository;
        }

        public async Task AddRolePermission(RolePermission rolePermission)
        {
            await _rolePermissionRepository.AddRolePermission(rolePermission);
        }

        public async Task<IEnumerable<RolePermission>> GetRolePermissionsByRoleId(int roleId)
        {
            return await _rolePermissionRepository.GetRolePermissionsByRoleId(roleId);
        }

        public async Task<Boolean> IsRolePermissionAlreadyAssigned(int permissionId)
        {
            return await _rolePermissionRepository.IsRolePermissionAlreadyAssigned(permissionId);
        }

        public async Task DeleteRolePermission(int roleId, int permissionId)
        {
            await _rolePermissionRepository.DeleteRolePermission(roleId, permissionId);
        }

    }
}
