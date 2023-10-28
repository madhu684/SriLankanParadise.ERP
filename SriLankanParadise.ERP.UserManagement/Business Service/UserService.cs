using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.Models;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<User> GetUserByUsername(string username)
        {
            return await _userRepository.GetUserByUsername(username);
        }

        public bool VerifyExpiryDate(DateTime? subscriptionExpiredDate)
        {
            return subscriptionExpiredDate.HasValue && subscriptionExpiredDate.Value > DateTime.UtcNow;
        }

        public bool VerifyPassword(string inputPassword, string storedHash)
        {
            //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(inputPassword, BCrypt.Net.BCrypt.GenerateSalt(12));

            return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
        }
    }
}
