using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        public UserRoleService(IUserRoleRepository userRoleRepository)
        {
            _userRoleRepository = userRoleRepository;
        }

        public async Task AddUserRole(UserRole userRole)
        {
            await _userRoleRepository.AddUserRole(userRole);
        }

        public async Task<IEnumerable<Role>> GetUserRolesByUserId(int userId)
        {
            return await _userRoleRepository.GetUserRolesByUserId(userId);
        }

        public async Task<IEnumerable<RolePermission>> GetUserRolePermissionsByUserId(int userId)
        {
            return await _userRoleRepository.GetUserRolePermissionsByUserId(userId);
        }

        public async Task DeleteUserRoles(int userId)
        {
            await _userRoleRepository.DeleteUserRoles(userId);
        }
    }
}
