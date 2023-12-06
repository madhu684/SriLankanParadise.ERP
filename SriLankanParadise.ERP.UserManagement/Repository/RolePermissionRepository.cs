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
    }
}
