using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;
using System.Reflection;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ErpSystemContext _dbContext;

        public RoleRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Dictionary<int, List<Role>>> GetRolesByModuleIds(int[] moduleIds)
        {
            try
            {
                if (moduleIds == null || moduleIds.Length == 0)
                {
                    throw new ArgumentException("ModuleIds cannot be null or empty.");
                }

                var rolesByModule = new Dictionary<int, List<Role>>();

                foreach (var moduleId in moduleIds)
                {
                    var rolesForModule = await _dbContext.Roles
                        .Where(r => r.ModuleId == moduleId)
                        .ToListAsync();

                    rolesByModule[moduleId] = rolesForModule;
                }

                if (rolesByModule.Any())
                {
                    return rolesByModule;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task AddRole(Role role)
        {
            try
            {
                _dbContext.Roles.Add(role);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Role>> GetAll()
        {
            try
            {
                return await _dbContext.Roles.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<Role>> GetRolesByCompanyId(int companyId)
        {
            try
            {
                var roles = await _dbContext.Roles
                    .Where(r => r.CompanyId == companyId || r.CompanyId == null)
                    .Include(r => r.Module)
                    .ToListAsync();

                return roles.Any() ? roles : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        
        public async Task<Role> GetRoleByRoleId(int roleId)
        {
            try
            {
                var unit = await _dbContext.Roles
                    .Where(r => r.RoleId == roleId)
                    .FirstOrDefaultAsync();

                return unit;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateRole(int roleId, Role role)
        {
            try
            {
                var existRole = await _dbContext.Roles.FindAsync(roleId);

                if (existRole != null)
                {
                    _dbContext.Entry(existRole).CurrentValues.SetValues(role);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task Delete(int roleId)
        {
            try
            {
                var userRoles = await _dbContext.UserRoles
                    .Where(ur => ur.RoleId == roleId)
                    .ToListAsync();

                if (userRoles.Any())
                {
                    throw new Exception("Role cannot be deleted because it is assigned to at least one user.");
                }

                var role = await _dbContext.Roles
                    .Where(r => r.RoleId == roleId)
                    .FirstOrDefaultAsync();

                if (role != null)
                {
                    _dbContext.Roles.Remove(role);
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
