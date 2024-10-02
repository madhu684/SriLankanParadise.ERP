using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUserRoleRepository
    {
        Task AddUserRole(UserRole userRole);

        Task<IEnumerable<UserRole>> GetByUserId(int userId);
    }
}
