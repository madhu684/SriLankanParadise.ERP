using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class UserPermissionService :IUserPermissionService
    {
        private readonly IUserPermissionRepository _userPermissionRepository;
        public UserPermissionService(IUserPermissionRepository userPermissionRepository)
        {
            _userPermissionRepository = userPermissionRepository;
        }

        public async Task AddUserPermission(UserPermission userPermission)
        {
            await _userPermissionRepository.AddUserPermission(userPermission);
        }

        public async Task<IEnumerable<UserPermission>> GetUserPermissionsByUserId(int userId)
        {
            return await _userPermissionRepository.GetUserPermissionsByUserId(userId);
        }
        public async Task DeleteUserPermissions(int userId)
        {
            await _userPermissionRepository.DeleteUserPermissions(userId);
        }
    }
}
