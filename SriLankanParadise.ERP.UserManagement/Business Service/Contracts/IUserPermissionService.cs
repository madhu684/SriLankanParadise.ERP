using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IUserPermissionService
    {
        Task AddUserPermission(UserPermission userPermission);

        Task<IEnumerable<UserPermission>> GetUserPermissionsByUserId(int userId);
    }
}
