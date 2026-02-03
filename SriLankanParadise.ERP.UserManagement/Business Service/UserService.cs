using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
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

        public async Task RegisterUser(User newUser)
        {
            await _userRepository.RegisterUser(newUser);
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

        public async Task<IEnumerable<User>> GetAllUsersByCompanyId(int companyId)
        {
            return await _userRepository.GetAllUsersByCompanyId(companyId);
        }

        public async Task<User> GetUserByUserId(int userId)
        {
            return await _userRepository.GetUserByUserId(userId);
        }

        public async Task UpdateUser(int userId, User user)
        {
            await _userRepository.UpdateUser(userId, user);
        }

        public async Task Deactivate(int userId)
        {
            await _userRepository.Deactivate(userId);
        }

        public async Task Activate(int userId)
        {
            await _userRepository.Activate(userId);
        }

        public async Task<bool> ResetPasswordAsync(int userId, string password)
        {
            var user = await _userRepository.GetUserByUserId(userId);
            if (user == null)
            {
                return false;
            }
            var newHashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            await _userRepository.UpdatePassword(userId, newHashedPassword);

            return true;
        }
    }
}
