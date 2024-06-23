using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;
        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<Dictionary<int, List<Role>>> GetRolesByModuleIds(int[] moduleIds)
        {
            return await _roleRepository.GetRolesByModuleIds(moduleIds);
        }

        public async Task AddRole(Role role)
        {
            await _roleRepository.AddRole(role);
        }

        public async Task<IEnumerable<Role>> GetAll()
        {
            return await _roleRepository.GetAll();
        }

        public async Task<IEnumerable<Role>> GetRolesByCompanyId(int companyId)
        {
            return await _roleRepository.GetRolesByCompanyId(companyId);
        }

        public async Task<Role> GetRoleByRoleId(int roleId)
        {
            return await _roleRepository.GetRoleByRoleId(roleId);
        }

        public async Task UpdateRole(int roleId, Role role)
        {
            await _roleRepository.UpdateRole(roleId, role);
        }
    }
}
