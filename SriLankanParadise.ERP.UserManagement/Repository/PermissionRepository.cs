using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PermissionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Dictionary<int, List<Permission>>> GetPermissionsByModuleIds(int[] moduleIds)
        {
            try
            {
                if (moduleIds == null || moduleIds.Length == 0)
                {
                    throw new ArgumentException("ModuleIds cannot be null or empty.");
                }

                var permissionsByModule = new Dictionary<int, List<Permission>>();

                foreach (var moduleId in moduleIds)
                {
                    var permissionsForModule = await _dbContext.Permissions
                        .Where(p => p.ModuleId == moduleId && p.PermissionStatus == true)
                        .ToListAsync();

                    permissionsByModule[moduleId] = permissionsForModule;
                }

                if (permissionsByModule.Any())
                {
                    return permissionsByModule;
                }

                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}
