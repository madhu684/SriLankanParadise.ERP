using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IRoleService
    {
        Task<Dictionary<int, List<Role>>> GetRolesByModuleIds(int[] moduleIds);
    }
}
