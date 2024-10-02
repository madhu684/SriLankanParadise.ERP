using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IUserRoleService
    {
        Task AddUserRole(UserRole userRole);

        Task<IEnumerable<UserRole>> GetByUserId(int userId);
    }
}
