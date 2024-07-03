using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<LocationType>> GetLocationTypesByCompanyId(int companyId)
        {
            try
            {
                var locationTypes = await _dbContext.LocationTypes
                    .Where(lt => lt.CompanyId == companyId)
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
