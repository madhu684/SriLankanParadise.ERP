using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUserGeoLocationRepository
    {
        public Task<List<UserGeoLocation>> GetAllAsync();
        public Task<List<UserGeoLocation>> GetByUserIdAsync(int userId);
        public Task<List<UserGeoLocation>> GetByDateAsync(DateTime date);
        public Task<List<UserGeoLocation>> GetByUserIdAndDateAsync(int userId, DateTime date);
        public Task CreateGeoLocation(UserGeoLocation geoLocation);
    }
}