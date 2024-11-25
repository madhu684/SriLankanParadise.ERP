using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ErpSystemContext _dbContext;

        public UserRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<User> GetUserByUsername(string username)
        {
            try
            {
                var user = Task.FromResult(_dbContext.Users
                .Where(u => u.Username == username)
                .Where(u => u.Status == true)
                .Include(u => u.Company)
                .FirstOrDefault());
                return user;
            }
            catch (Exception)
            {
                throw;
            }

        }

        public async Task RegisterUser(User newUser)
        {
            try
            {
                _dbContext.Users.Add(newUser);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<User>> GetAllUsersByCompanyId(int companyId)
        {
            try
            {
                var users = await _dbContext.Users
                    .Where(u => u.CompanyId == companyId)
                    .ToListAsync();

                return users.Any() ? users : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<User> GetUserByUserId(int userId)
        {
            try
            {
                var user = await _dbContext.Users
                    .Where(u => u.UserId == userId)
                    .FirstOrDefaultAsync();

                return user;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateUser(int userId, User user)
        {
            try
            {
                var existUser = await _dbContext.Users.FindAsync(userId);

                if (existUser != null)
                {
                    _dbContext.Entry(existUser).CurrentValues.SetValues(user);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task Deactivate(int userId)
        {
            try
            {
                var user = await _dbContext.Users
                    .Where(u => u.UserId == userId)
                    .FirstOrDefaultAsync();

                if (user != null)
                {
                    user.IsDeleted = true;
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task Activate(int userId)
        {
            try
            {
                var user = await _dbContext.Users
                    .Where(u => u.UserId == userId)
                    .FirstOrDefaultAsync();

                if (user != null)
                {
                    user.IsDeleted = false;
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
