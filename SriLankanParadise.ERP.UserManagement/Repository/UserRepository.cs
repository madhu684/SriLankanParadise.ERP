using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Models;
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
                return Task.FromResult(_dbContext.Users
                .Where(u => u.Username == username)
                .Include(u => u.Company) // Ensure Company is included in the query
                .FirstOrDefault());
            }
            catch (Exception ex)
            {
                throw;
            }

        }
    }
}
