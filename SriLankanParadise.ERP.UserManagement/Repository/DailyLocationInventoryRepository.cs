using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
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

        public async Task<DailyLocationInventory> Add(DailyLocationInventory dailyLocationInventory, DateTime transactionDate, int m)
        {
            try
            {
                var runDate = DateOnly.FromDateTime(transactionDate);
                var existingDailyInventory = await dbContext.DailyLocationInventories
                    .Where(d =>
                        d.RunDate == runDate &&
                        d.LocationId == dailyLocationInventory.LocationId &&
                        d.ItemMasterId == dailyLocationInventory.ItemMasterId &&
                        d.BatchNo == dailyLocationInventory.BatchNo)
                    .FirstOrDefaultAsync();

                if (existingDailyInventory != null)
                {
                    if (m == 1)
                    {
                        await dbContext.DailyLocationInventories
                            .Where(d => d.Id == existingDailyInventory.Id)
                            .ExecuteUpdateAsync(setters => setters
                                .SetProperty(d => d.StockInHand, existingDailyInventory.StockInHand + dailyLocationInventory.StockInHand));
                    }
                    else if (m == 2)
                    {
                        await dbContext.DailyLocationInventories
                            .Where(d => d.Id == existingDailyInventory.Id)
                            .ExecuteUpdateAsync(setters => setters
                                .SetProperty(d => d.StockInHand, existingDailyInventory.StockInHand - dailyLocationInventory.StockInHand));
                    }
                    else
                    {
                        await dbContext.DailyLocationInventories
                            .Where(d => d.Id == existingDailyInventory.Id)
                            .ExecuteUpdateAsync(setters => setters
                                .SetProperty(d => d.StockInHand, dailyLocationInventory.StockInHand));
                    }
                    return existingDailyInventory;

                }
                else
                {
                    var existingLocationInventory = await dbContext.LocationInventories
                        .FirstOrDefaultAsync(l => l.LocationId == dailyLocationInventory.LocationId 
                            && l.ItemMasterId == dailyLocationInventory.ItemMasterId 
                            && l.BatchNo == dailyLocationInventory.BatchNo
                            && l.StockInHand > 0);

                    if (existingLocationInventory != null)
                    {
                        var dialyInventory = new DailyLocationInventory()
                        {
                            RunDate = runDate,
                            LocationInventoryId = existingLocationInventory.LocationInventoryId,
                            ItemMasterId = existingLocationInventory.ItemMasterId,
                            BatchId = existingLocationInventory.BatchId,
                            LocationId = existingLocationInventory.LocationId,
                            StockInHand = existingLocationInventory.StockInHand,
                            BatchNo = existingLocationInventory.BatchNo,
                            CreatedDate = dailyLocationInventory.CreatedDate,
                            ExpirationDate = existingLocationInventory.ExpirationDate
                        };

                        await dbContext.DailyLocationInventories.AddAsync(dialyInventory);
                        await dbContext.SaveChangesAsync();

                        return dialyInventory;

                    }
                    return dailyLocationInventory;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Add method: {ex.Message}");
                throw;
            }
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
            else
            {
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


        public async Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationTypeId, int locationId)
        {
            var dailyLocationInventories = new List<DailyLocationInventory>();

            if (locationId != 0)
            {
                dailyLocationInventories = await dbContext.DailyLocationInventories
                    .AsNoTracking()
                    .Include(d => d.Location)
                    .Where(d => d.Location.LocationTypeId == locationTypeId && d.LocationId == locationId && d.RunDate == runDate)
                    .Include(d => d.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .ToListAsync();
            }
            else {
                dailyLocationInventories = await dbContext.DailyLocationInventories
                   .AsNoTracking()
                   .Where(d => d.Location.LocationTypeId == locationTypeId && d.RunDate == runDate)
                   .Include(d => d.Location)
                   .Include(d => d.ItemMaster)
                       .ThenInclude(im => im.Unit)
                   .ToListAsync();
            }

            return dailyLocationInventories;
        }

        public async Task<DailyLocationInventory> Get(DateOnly runDate, int itemMasterId, string batchNo, int locationId)
        {
             var dailyLocationInventory = await dbContext.DailyLocationInventories
                .AsNoTracking()
                .Where(d => d.RunDate == runDate)
                .Where(d => d.LocationId == locationId && d.ItemMasterId == itemMasterId && d.BatchNo == batchNo)
                .Include(d => d.Location)
                .Include(d => d.ItemMaster)
                    .ThenInclude(im => im.Unit)
                .FirstOrDefaultAsync();

            if(dailyLocationInventory != null)
            {
                return dailyLocationInventory;
            }
            return null;
        }

        public async Task<IEnumerable<DailyLocationInventory>> GetByItemId(DateOnly runDate, int itemMasterId)
        {
            var dailyLocationInventories = new List<DailyLocationInventory>();
            
            dailyLocationInventories = await dbContext.DailyLocationInventories
                .AsNoTracking()
                .Where(d => d.RunDate == runDate && d.ItemMasterId == itemMasterId)
                .Include(d => d.Location)
                .Include(d => d.ItemMaster)
                    .ThenInclude(im => im.Unit)
                .ToListAsync();

            return dailyLocationInventories;
        }
    }
}
