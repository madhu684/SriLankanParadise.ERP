using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class UserGeoLocationRepository : IUserGeoLocationRepository
    {
        private readonly ErpSystemContext _dbContext;
        public UserGeoLocationRepository(ErpSystemContext dbContext) 
        { 
            _dbContext = dbContext;
        }

        public async Task CreateGeoLocation(UserGeoLocation geoLocation)
        {
            try
            {
                _dbContext.UserGeoLocations.Add(geoLocation);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<UserGeoLocation>> GetAllAsync()
        {
            try
            {
                return await _dbContext.UserGeoLocations.ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<UserGeoLocation>> GetByDateAsync(DateTime date)
        {
            try
            {
                var userGeoLocations = await _dbContext.UserGeoLocations
                    .Where(l => l.GeoDate == date)
                    .ToListAsync();

                return userGeoLocations.Any() ? userGeoLocations : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<UserGeoLocation>> GetByUserIdAndDateAsync(int userId, DateTime date)
        {
            try
            {
                var userGeoLocations = await _dbContext.UserGeoLocations
                    .Where(ug => ug.GeoDate == date && ug.UserProfileId == userId)
                    .ToListAsync();

                return userGeoLocations.Any() ? userGeoLocations : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<UserGeoLocation>> GetByUserIdAsync(int userId)
        {
            try
            {
                var userGeoLocations = await _dbContext.UserGeoLocations
                    .Where(u => u.UserProfileId == userId)
                    .ToListAsync();

                return userGeoLocations.Any() ? userGeoLocations : null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}