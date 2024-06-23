using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionRepository _permissionRepository;
        public PermissionService(IPermissionRepository permissionRepository)
        {
            _permissionRepository = permissionRepository;
        }

        public async Task<Dictionary<int, List<Permission>>> GetPermissionsByModuleIds(int[] moduleIds)
        {
            return await _permissionRepository.GetPermissionsByModuleIds(moduleIds);
        }

        public async Task AddPermission(Permission permission)
        {
            await _permissionRepository.AddPermission(permission);
        }

        public async Task<IEnumerable<Permission>> GetAll()
        {
            return await _permissionRepository.GetAll();
        }

        /*public async Task<IEnumerable<Permission>> GetPermissionsByCompanyId(int companyId)
        {
            return await _permissionRepository.GetPermissionsByCompanyId(companyId);
        }*/

        public async Task<Permission> GetPermissionByPermissionId(int permissionId)
        {
            return await _permissionRepository.GetPermissionByPermissionId(permissionId);
        }

        public async Task UpdatePermission(int permissionId, Permission permission)
        {
            await _permissionRepository.UpdatePermission(permissionId, permission);
        }
    }
}
