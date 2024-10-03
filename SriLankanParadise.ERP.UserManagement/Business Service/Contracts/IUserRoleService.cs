using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IUserRoleService
    {
        Task AddUserRole(UserRole userRole);

        Task<IEnumerable<Role>> GetUserRolesByUserId(int userId);

        Task<IEnumerable<RolePermission>> GetUserRolePermissionsByUserId(int userId);

        Task UpdateUserRole(UserRole userRole);
    }
}
