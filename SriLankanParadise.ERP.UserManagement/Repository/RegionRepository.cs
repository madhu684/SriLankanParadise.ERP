using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class RegionRepository : IRegionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public RegionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Region>> GetAll()
        {
            try
            {
                return await _dbContext.Regions
                    .AsNoTracking()
                    .Where(r => r.IsActive)
                    .ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Region?> GetById(int id)
        {
            try
            {
                var region = await _dbContext.Regions
                    .AsNoTracking()
                    .FirstOrDefaultAsync(r => r.RegionId == id && r.IsActive);

                return region;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
