using SriLankanParadise.ERP.UserManagement.Models;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsername(string username);
    }
}
