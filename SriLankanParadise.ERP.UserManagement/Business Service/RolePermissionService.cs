using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class RolePermissionService :IRolePermissionService
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

    }
}
