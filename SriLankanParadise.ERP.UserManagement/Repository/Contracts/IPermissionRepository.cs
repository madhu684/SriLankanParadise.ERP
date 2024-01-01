using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPermissionRepository
    {
        Task<Dictionary<int, List<Permission>>> GetPermissionsByModuleIds(int[] moduleIds);
    }
}
