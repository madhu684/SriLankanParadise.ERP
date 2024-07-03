using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IRoleService
    {
        Task<Dictionary<int, List<Role>>> GetRolesByModuleIds(int[] moduleIds);

        Task AddRole(Role role);

        Task<IEnumerable<Role>> GetAll();

        Task<IEnumerable<Role>> GetRolesByCompanyId(int companyId);

        Task<Role> GetRoleByRoleId(int roleId);

        Task UpdateRole(int roleId, Role role);
    }
}
