using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUserPermissionRepository
    {
        Task AddUserPermission(UserPermission userPermission);

        Task<IEnumerable<UserPermission>> GetUserPermissionsByUserId(int userId);
        Task DeleteUserPermissions(int userId);

    }
}
