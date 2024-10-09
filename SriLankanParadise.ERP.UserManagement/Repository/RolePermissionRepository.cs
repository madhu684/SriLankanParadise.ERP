using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class RolePermissionRepository :IRolePermissionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public RolePermissionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddRolePermission(RolePermission rolePermission)
        {
            try
            {
                _dbContext.RolePermissions.Add(rolePermission);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<RolePermission>> GetRolePermissionsByRoleId(int roleId)
        {
            try
            {
                return await _dbContext.RolePermissions
                    .Where(rp => rp.RoleId == roleId)
                    .ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Boolean> IsRolePermissionAlreadyAssigned(int permissionId)
        {
            try {
                return await _dbContext.UserPermissions
                    .AnyAsync(rp => rp.PermissionId == permissionId);
            }
            catch (Exception) {
                return false;
            }
        }

        public async Task DeleteRolePermission(int roleId, int permissionId)
        {
            try
            {
                var rolePermission = await _dbContext.RolePermissions
                    .Where(up => up.RoleId == roleId && up.PermissionId == permissionId)
                    .FirstOrDefaultAsync();

                if (rolePermission != null)
                {
                    _dbContext.RolePermissions.Remove(rolePermission);
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
