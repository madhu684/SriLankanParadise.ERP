using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class DailyLocationInventoryRepository : IDailyLocationInventoryRepository
    {
        private readonly ErpSystemContext _dbContext;

        public DailyLocationInventoryRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId)
        {
            var dailyLocationInventories = new List<DailyLocationInventory>();

            if (locationId != 0)
            {
                dailyLocationInventories = await _dbContext.DailyLocationInventories
                    .AsNoTracking()
                    .Where(d => d.RunDate == runDate && d.LocationId == locationId)
                    .Include(d => d.Location)
                    .Include(d => d.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(d => d.Batch)
                    .ToListAsync();
            }
            else
            {
                dailyLocationInventories = await _dbContext.DailyLocationInventories
                   .AsNoTracking()
                   .Where(d => d.RunDate == runDate)
                   .Include(d => d.Location)
                   .Include(d => d.ItemMaster)
                       .ThenInclude(im => im.Unit)
                   .Include(d => d.Batch)
                   .ToListAsync();
            }

            return dailyLocationInventories;
        }
    }
}
