using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IPermissionService
    {
        Task<Dictionary<int, List<Permission>>> GetPermissionsByModuleIds(int[] moduleIds);
    }
}
