using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IPermissionService
    {
        Task<Dictionary<int, List<Permission>>> GetPermissionsByModuleIds(int[] moduleIds);

        Task AddPermission(Permission permission);

        Task<IEnumerable<Permission>> GetAll();

        Task<IEnumerable<Permission>> GetPermissionsByCompanyId(int companyId);

        Task<Permission> GetPermissionByPermissionId(int permissionId);

        Task UpdatePermission(int permissionId, Permission permission);

        Task Delete(int permissionId);
    }
}
