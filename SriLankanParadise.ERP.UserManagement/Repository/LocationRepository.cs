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
    }
}
