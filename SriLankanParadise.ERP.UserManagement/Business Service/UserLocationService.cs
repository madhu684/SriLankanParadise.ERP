using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class UserLocationService : IUserLocationService
    {
        private readonly IUserLocationRepository _userLocationRepository;
        public UserLocationService(IUserLocationRepository userLocationRepository)
        {
            _userLocationRepository = userLocationRepository;
        }

        public async Task AddUserLocation(UserLocation userLocation)
        {
            await _userLocationRepository.AddUserLocation(userLocation);
        }

        public async Task<IEnumerable<UserLocation>> GetAll()
        {
            return await _userLocationRepository.GetAll();
        }

        public async Task<IEnumerable<UserLocation>> GetUserLocationsByUserId(int userId)
        {
            return await _userLocationRepository.GetUserLocationsByUserId(userId);
        }


        public async Task<UserLocation> GetUserLocationByUserLocationId(int userLocationId)
        {
            return await _userLocationRepository.GetUserLocationByUserLocationId(userLocationId);
        }

        public async Task UpdateUserLocation(int userLocationId, UserLocation userLocation)
        {
            await _userLocationRepository.UpdateUserLocation(userLocationId, userLocation);
        }

        public async Task DeleteUserLocation(int userLocationId)
        {
            await _userLocationRepository.DeleteUserLocation(userLocationId);
        }
        public async Task DeleteUserLocations(int userId)
        {
            await _userLocationRepository.DeleteUserLocations(userId);
        }
    }
}
