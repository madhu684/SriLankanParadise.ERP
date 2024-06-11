using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUserLocationRepository
    {
        Task AddUserLocation(UserLocation userLocation);

        Task<IEnumerable<UserLocation>> GetAll();

        Task<IEnumerable<UserLocation>> GetUserLocationsByUserId(int userId);

        Task<UserLocation> GetUserLocationByUserLocationId(int userLocationId);

        Task UpdateUserLocation(int userLocationId, UserLocation userLocation);

        Task DeleteUserLocation(int userLocationId);
    }
}
