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

        public async Task<IEnumerable<UserRole>> GetByUserId(int userId)
        {
            return await _userRoleRepository.GetByUserId(userId);
        }
    }
}
