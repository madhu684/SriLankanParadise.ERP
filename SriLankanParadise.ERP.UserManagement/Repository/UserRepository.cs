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
    }
}
