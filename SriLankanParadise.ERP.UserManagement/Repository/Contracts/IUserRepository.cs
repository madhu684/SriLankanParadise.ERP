using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsername(string username);

        Task RegisterUser(User newUser);

        Task<IEnumerable<User>> GetAllUsersByCompanyId(int companyId);

        Task<User> GetUserByUserId(int userId);

        Task UpdateUser(int UserId, User user);
    }
}
