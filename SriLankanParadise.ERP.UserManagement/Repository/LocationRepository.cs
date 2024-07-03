using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class LocationRepository : ILocationRepository
    {
        private readonly ErpSystemContext _dbContext;

        public LocationRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Location>> GetLocationsByCompanyId(int companyId)
        {
            try
            {
                var locations = await _dbContext.Locations
                    .Where(l => l.CompanyId == companyId)
                    .Include(l => l.LocationType)
                    .ToListAsync();
               
                if (locations.Any())
                {
                    return locations;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task AddLocation(Location location)
        {
            try
            {
                _dbContext.Locations.Add(location);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Location> GetLocationByLocationId(int locationId)
        {
            try
            {
                var location = await _dbContext.Locations
                    .Where(l => l.LocationId == locationId)
                    .Include(l => l.LocationType)
                    .FirstOrDefaultAsync();

                return location;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateLocation(int locationId, Location location)
        {
            try
            {
                var existLocation = await _dbContext.Locations.FindAsync(locationId);

                if (existLocation != null)
                {
                    _dbContext.Entry(existLocation).CurrentValues.SetValues(location);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Location>> GetLocationsByLocationIds(int[] locationIds)
        {
            return await _dbContext.Locations
                .Where(l => locationIds.Contains(l.LocationId))
                .ToListAsync();
        }

    }
}
