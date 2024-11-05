using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class DailyLocationInventoryRepository : IDailyLocationInventoryRepository
    {
        private readonly ErpSystemContext dbContext;

        public DailyLocationInventoryRepository(ErpSystemContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task Add(DailyLocationInventory dailyLocationInventory)
        {
            await dbContext.AddAsync(dailyLocationInventory);
            await dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId)
        {
            var dailyLocationInventories = new List<DailyLocationInventory>();

            if (locationId != 0)
            {
                dailyLocationInventories = await dbContext.DailyLocationInventories
                    .AsNoTracking()
                   .Where(d => d.LocationId == locationId && d.RunDate == runDate)
                    .Include(d => d.Location)
                    .Include(d => d.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .ToListAsync();
            }
            else {
                dailyLocationInventories = await dbContext.DailyLocationInventories
                   .AsNoTracking()
                   .Where(d => d.RunDate == runDate)
                   .Include(d => d.Location)
                   .Include(d => d.ItemMaster)
                       .ThenInclude(im => im.Unit)
                   .ToListAsync();
            }

            return dailyLocationInventories;
        }
    }
}
