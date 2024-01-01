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



    }
}
