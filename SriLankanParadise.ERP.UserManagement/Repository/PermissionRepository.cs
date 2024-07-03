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

        public async Task AddPermission(Permission permission)
        {
            try
            {
                _dbContext.Permissions.Add(permission);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Permission>> GetAll()
        {
            try
            {
                return await _dbContext.Permissions
                    .Where(p => p.PermissionStatus == true)
                    .Include(p => p.Module)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<Permission>> GetPermissionsByCompanyId(int companyId)
        {
            try
            {
                var permissions = await _dbContext.Permissions
                    .Where(p => p.CompanyId == companyId || p.CompanyId == null)
                    .Include(p => p.Module)
                    .ToListAsync();

                return permissions.Any() ? permissions : null;
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<Permission> GetPermissionByPermissionId(int permissionId)
        {
            try
            {
                var permission = await _dbContext.Permissions
                    .Where(p => p.PermissionId == permissionId)
                    .FirstOrDefaultAsync();

                return permission;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdatePermission(int permissionId, Permission permission)
        {
            try
            {
                var existPermission = await _dbContext.Permissions.FindAsync(permissionId);

                if (existPermission != null)
                {
                    _dbContext.Entry(existPermission).CurrentValues.SetValues(permission);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
