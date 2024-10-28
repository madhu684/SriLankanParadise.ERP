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

        public async Task<DailyLocationInventory> Get(DateTime runDate, int locationId)
        {
           var dailyLocationInventory = await dbContext.DailyLocationInventories
                .Where(d => d.RunDate == runDate && d.LocationId == locationId)
                .FirstOrDefaultAsync();

            if(dailyLocationInventory == null) {
                return null;
            }
            return dailyLocationInventory;
        }
    }
}
