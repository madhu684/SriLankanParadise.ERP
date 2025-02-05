﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IUserLocationService
    {
        Task AddUserLocation(UserLocation userLocation);

        Task<IEnumerable<UserLocation>> GetAll();

        Task<IEnumerable<UserLocation>> GetUserLocationsByUserId(int userId);

        Task<UserLocation> GetUserLocationByUserLocationId(int userLocationId);

        Task DeleteUserLocations(int userId);
    }
}
