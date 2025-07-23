using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
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
        public async Task<Dictionary<int, List<RolePermission>>> GetRolePermissionsByRoleIds(int[] roleIds)
        {
            try
            {
                if (roleIds == null || roleIds.Length == 0)
                {
                    throw new ArgumentException("RoleIds cannot be null or empty.");
                }

                var rolePermissionsByRole = new Dictionary<int, List<RolePermission>>();

                foreach (var roleId in roleIds)
                {
                    var rolePermissions = await _dbContext.RolePermissions
                        .Where(p => p.RoleId == roleId)
                        .Include(rp => rp.Permission)
                        .ToListAsync();

                    rolePermissionsByRole[roleId] = rolePermissions;
                }

                if (rolePermissionsByRole.Any())
                {
                    return rolePermissionsByRole;
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
