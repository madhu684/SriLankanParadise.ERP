using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IRoleRepository
    {
        Task<Dictionary<int, List<Role>>> GetRolesByModuleIds(int[] moduleIds);
    }
}
