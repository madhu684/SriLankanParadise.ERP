using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class UserGeoLocationService : IUserGeoLocationService
    {
        private readonly IUserGeoLocationRepository _userGeoLocationRepository;
        public UserGeoLocationService(IUserGeoLocationRepository userGeoLocationRepository)
        {
            _userGeoLocationRepository = userGeoLocationRepository;
        }

        public async Task CreateGeoLocation(UserGeoLocation geoLocation)
        {
            await _userGeoLocationRepository.CreateGeoLocation(geoLocation);
        }

        public async Task<List<UserGeoLocation>> GetAllAsync()
        {
            return await _userGeoLocationRepository.GetAllAsync();
        }

        public async Task<List<UserGeoLocation>> GetByDateAsync(DateTime date)
        {
            return await _userGeoLocationRepository.GetByDateAsync(date);
        }

        public async Task<List<UserGeoLocation>> GetByUserIdAndDateAsync(int userId, DateTime date)
        {
            return await _userGeoLocationRepository.GetByUserIdAndDateAsync(userId, date);
        }

        public async Task<List<UserGeoLocation>> GetByUserIdAsync(int userId)
        {
            return await _userGeoLocationRepository.GetByUserIdAsync(userId);
        }
    }
}