using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPermissionRepository
    {
        Task<Dictionary<int, List<Permission>>> GetPermissionsByModuleIds(int[] moduleIds);

        Task AddPermission(Permission permission);

        Task<IEnumerable<Permission>> GetAll();

       // Task<IEnumerable<Permission>> GetRolesByCompanyId(int companyId);

        Task<Permission> GetPermissionByPermissionId(int permissionId);

        Task UpdatePermission(int permissionId, Permission permission);
    }
}
