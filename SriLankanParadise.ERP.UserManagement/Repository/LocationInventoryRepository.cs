using Azure;
using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

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
                // Check if a record with the same ItemMasterId, BatchNo, and LocationId exists
                var existingInventory = await _dbContext.LocationInventories
                    .FirstOrDefaultAsync(li => li.ItemMasterId == locationInventory.ItemMasterId
                                            && li.BatchNo == locationInventory.BatchNo
                                            && li.LocationId == locationInventory.LocationId);

                if (existingInventory != null)
                {
                    if (m == 1)
                    {
                        existingInventory.StockInHand += locationInventory.StockInHand;
                    }
                    else if (m == 2)
                    {
                        existingInventory.StockInHand -= locationInventory.StockInHand;
                    }
                }
                else
                {
                    // If a record with the same ItemMasterId and BatchNo exists (regardless of LocationId)
                    var batchInventory = await _dbContext.LocationInventories
                        .FirstOrDefaultAsync(li => li.ItemMasterId == locationInventory.ItemMasterId
                                                && li.BatchNo == locationInventory.BatchNo);

                    if (batchInventory != null && batchInventory.ExpirationDate != null)
                    {
                        // Add the existing record's ExpireDate to the new record's ExpireDate
                        locationInventory.ExpirationDate = batchInventory.ExpirationDate;
                    }
                    _dbContext.LocationInventories.Add(locationInventory);
                }
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
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

        public async Task<LocationInventory> GetUniqueLocationInventory(int locationId, int itemMasterId, string batchNo)
        {
            try
            {
                var locationInventory = await _dbContext.LocationInventories
                   .Where(li => li.LocationId == locationId && li.ItemMasterId == itemMasterId && li.BatchNo == batchNo)
                   .FirstOrDefaultAsync();

                return locationInventory;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
