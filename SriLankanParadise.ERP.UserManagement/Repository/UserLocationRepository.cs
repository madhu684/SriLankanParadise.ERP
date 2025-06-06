using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class UserLocationRepository : IUserLocationRepository
    {
        private readonly ErpSystemContext _dbContext;

        public UserLocationRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddUserLocation(UserLocation userLocation)
        {
            try
            {
                _dbContext.UserLocations.Add(userLocation);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<UserLocation>> GetAll()
        {
            try
            {
                return await _dbContext.UserLocations.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<UserLocation>> GetUserLocationsByUserId(int userId)
        {
            try
            {
                var userLocations = await _dbContext.UserLocations
                    .Where(ul =>  ul.UserId == userId)
                    .Include(ul => ul.Location)
                    .ThenInclude(l => l.LocationType)
                    .ToListAsync();

                return userLocations.Any() ? userLocations : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        
        public async Task<UserLocation> GetUserLocationByUserLocationId(int userLocationId)
        {
            try
            {
                var userLocation = await _dbContext.UserLocations
                    .Where(ul => ul.UserLocationId == userLocationId )
                    .FirstOrDefaultAsync();

                return userLocation;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateUserLocation(int userLocationId, UserLocation userLocation)
        {
            try
            {
                var existUserLocation = await _dbContext.UserLocations.FindAsync(userLocationId);

                if (existUserLocation != null)
                {
                    _dbContext.Entry(existUserLocation).CurrentValues.SetValues(userLocation);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteUserLocation(int userLocationId)
        {
            try
            {
                var userLocation = await _dbContext.UserLocations.FindAsync(userLocationId);

                if (userLocation != null)
                {
                    _dbContext.UserLocations.Remove(userLocation);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteUserLocations(int userId)
        {
            try
            {
                var userLocations = await _dbContext.UserLocations
                    .Where(ul => ul.UserId == userId)
                    .ToListAsync();

                if (userLocations.Any())
                {
                    _dbContext.UserLocations.RemoveRange(userLocations);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
