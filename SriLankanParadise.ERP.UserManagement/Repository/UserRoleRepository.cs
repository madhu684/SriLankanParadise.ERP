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

        public async Task<IEnumerable<UserRole>> GetByUserId(int userId)
        {
            try
            {
                return await _dbContext.UserRoles
                    .Where(ur => ur.UserId == userId)
                    .Include(ur => ur.User)
                    .Include(ur => ur.Role)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
