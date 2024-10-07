using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUserRoleRepository
    {
        Task AddUserRole(UserRole userRole);

        Task<IEnumerable<Role>> GetUserRolesByUserId(int userId);

        Task<IEnumerable<RolePermission>> GetUserRolePermissionsByUserId(int userId);

        Task DeleteUserRoles(int userId);
    }
}
