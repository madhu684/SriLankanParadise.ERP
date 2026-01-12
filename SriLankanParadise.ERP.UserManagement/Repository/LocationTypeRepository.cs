using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class LocationTypeRepository : ILocationTypeRepository
    {
        private readonly ErpSystemContext _dbContext;

        public LocationTypeRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<LocationType>> GetLocationTypesByCompanyId()
        {
            try
            {
                var locationTypes = await _dbContext.LocationTypes
                    .ToListAsync();

                return locationTypes.Any() ? locationTypes : null;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
