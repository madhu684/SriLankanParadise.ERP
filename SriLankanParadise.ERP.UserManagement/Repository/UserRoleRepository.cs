using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly ErpSystemContext _dbContext;

        public UserRoleRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddUserRole(UserRole userRole)
        {
            try
            {
                _dbContext.UserRoles.Add(userRole);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Role>> GetUserRolesByUserId(int userId)
        {
            try
            {
                var roles = new List<Role>();

                var userRoles = await _dbContext.UserRoles
                    .Where(x => x.UserId == userId)
                    .ToListAsync();

                foreach (var userRole in userRoles)
                {
                    var role = await _dbContext.Roles
                        .Where(x => x.RoleId == userRole.RoleId)
                        .FirstOrDefaultAsync();

                    if (role != null)
                    {
                        roles.Add(role);
                    }

                }
                return roles;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
