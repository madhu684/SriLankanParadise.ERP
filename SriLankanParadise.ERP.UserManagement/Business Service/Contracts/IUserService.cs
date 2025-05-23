using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IUserService
    {
        Task<User> GetUserByUsername(string username);
        bool VerifyPassword(string inputPassword, string storedHash);
        bool VerifyExpiryDate(DateTime? subscriptionExpiredDate);
        Task RegisterUser(User newUser);
        Task<IEnumerable<User>> GetAllUsersByCompanyId(int companyId);
        Task<User> GetUserByUserId(int userId);
        Task UpdateUser(int UserId, User user);

        Task<bool> UpdatePasswordAsync(int userId, ForgetPasswordRequestModel model);

        Task<bool> ResetPasswordAsync(int userId, string password);
        Task Deactivate(int userId);
        Task Activate(int userId);

    }
}
