using Azure;
using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class LocationInventoryRepository : ILocationInventoryRepository
    {
        private readonly ErpSystemContext _dbContext;

        public LocationInventoryRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddLocationInventory(LocationInventory locationInventory, int m)
        {
            try
            {
                // Check if a record with the same ItemMasterId, BatchId, and LocationId exists
                var existingInventory = await _dbContext.LocationInventories
                    .FirstOrDefaultAsync(li => li.ItemMasterId == locationInventory.ItemMasterId
                                            && li.BatchId == locationInventory.BatchId
                                            && li.LocationId == locationInventory.LocationId);

                if (existingInventory != null)
                {
                    // Update the StockInHand
                    if (m == 1)
                    {
                        existingInventory.StockInHand = existingInventory.StockInHand + locationInventory.StockInHand;
                    } else if (m == 2)
                    {
                        existingInventory.StockInHand = existingInventory.StockInHand - locationInventory.StockInHand;
                    }
                }
                else
                {
                    // Insert a new record
                    _dbContext.LocationInventories.Add(locationInventory);
                }

                // Save changes
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                // Handle exception (optional: log the exception, etc.)
                throw;
            }
        }

        public async Task<IEnumerable<LocationInventory>> GetAll()
        {
            try
            {
                return await _dbContext.LocationInventories.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<LocationInventory> GetLocationInventoryByLocationInventoryId(int locationInventoryId)
        {
            try
            {
                var locationInventory = await _dbContext.LocationInventories
                    .Where(li => li.LocationInventoryId == locationInventoryId)
                    .FirstOrDefaultAsync();

                return locationInventory;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationId(int locationId)
        {
            try
            {
                var locationInventories = await _dbContext.LocationInventories
                    .Where(li => li.LocationId == locationId)
                    .Include(li => li.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .ToListAsync();

                return locationInventories.Any() ? locationInventories : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<LocationInventory> GetLocationInventoryByDetails(int locationId, int itemMasterId, int batchId)
        {
            try
            {
                var locationInventory = await _dbContext.LocationInventories
                    .Where(li => li.LocationId == locationId && li.ItemMasterId == itemMasterId && li.BatchId == batchId)
                    .FirstOrDefaultAsync();

                return locationInventory;

            }
            catch (Exception )
            {
                
                throw;
            }
           
        }

        public async Task UpdateLocationInventory(int locationInventoryId, LocationInventory locationInventory)
        {
            try
            {
                var existUserLocationInventory = await _dbContext.LocationInventories.FindAsync(locationInventoryId);

                if (existUserLocationInventory != null)
                {
                    _dbContext.Entry(existUserLocationInventory).CurrentValues.SetValues(locationInventory);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, LocationInventory locationInventory, string operation )
        {
            try
            {
                var existLocationInventory = await _dbContext.LocationInventories.Where(li =>
                        li.LocationId == locationId && li.ItemMasterId == itemMasterId && li.BatchId == batchId)
                    .FirstOrDefaultAsync();


                if (existLocationInventory != null)
                {
                    if (operation.ToLower() == "set")
                    {
                        existLocationInventory.StockInHand = locationInventory.StockInHand;
                    }
                    else if (operation.ToLower() == "add")
                    {
                        existLocationInventory.StockInHand += locationInventory.StockInHand;
                    }
                    else if (operation.ToLower() == "subtract")
                    {
                        
                        existLocationInventory.StockInHand -= locationInventory.StockInHand;
                        
                    }

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
