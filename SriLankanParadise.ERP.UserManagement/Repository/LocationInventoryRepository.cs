using Azure;
using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
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
                // Build query based on whether BatchId is null or not
                LocationInventory? existingInventory;

                if (locationInventory.BatchId == null)
                {
                    // When BatchId is null, check only ItemMasterId and LocationId
                    existingInventory = await _dbContext.LocationInventories
                        .FirstOrDefaultAsync(li => li.ItemMasterId == locationInventory.ItemMasterId
                                                && li.LocationId == locationInventory.LocationId);
                }
                else
                {
                    // When BatchId has a value, check all three fields
                    existingInventory = await _dbContext.LocationInventories
                        .FirstOrDefaultAsync(li => li.ItemMasterId == locationInventory.ItemMasterId
                                                && li.LocationId == locationInventory.LocationId
                                                && li.BatchId == locationInventory.BatchId);
                }

                if (existingInventory != null)
                {
                    // Update the StockInHand
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
                return await _dbContext.LocationInventories
                     .ToListAsync();
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
                    .Include(li => li.ItemBatch)
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
                    .Include(li => li.ItemMaster)
                        .ThenInclude(im => im.Unit)
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

        public async Task<IEnumerable<LocationInventory>> GetEmptyReturnItemLocationInventoriesByLocationId(int companyId, int locationId)
        {
            try
            {
                var emptyItemType = await _dbContext.ItemTypes.FirstOrDefaultAsync(x => x.Name == "Empty" && x.CompanyId == companyId);

                if (emptyItemType != null)
                {
                    var locationInventories = await _dbContext.LocationInventories
                        .Where(li => li.LocationId == locationId)
                        .Include(li => li.ItemMaster)
                            .ThenInclude(im => im.Unit)
                        .Include(li => li.Location )
                        .ToListAsync();

                    var filteredItems = locationInventories
                        .Where(l => l.ItemMaster.ItemTypeId == emptyItemType.ItemTypeId)
                        .ToList();

                    return filteredItems.Any() ? filteredItems : null;
                }

                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationIdItemMasterId(int locationId , int itemMasterId)
        {
            try
            {
                var query = _dbContext.LocationInventories
                    .Where(li => li.LocationId == locationId && li.ItemMasterId == itemMasterId)
                    .Include(li => li.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .Include(li => li.ItemBatch)
                    .ThenInclude(ib => ib.ItemMaster);

                var sqlQuery = query.ToQueryString();

                var locationInventories = await _dbContext.LocationInventories
                    .Where(li => li.LocationId == locationId && li.ItemMasterId == itemMasterId)
                    .Include(li => li.ItemBatch)
                        .ThenInclude(ib => ib.Batch)
                    .Include(li => li.ItemBatch)
                        .ThenInclude(ib => ib.ItemMaster)
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
        public async Task<LocationInventory> GetEmptyLocationInventoryByDetails(int locationId, int itemMasterId)
        {
            try
            {
                var locationInventory = await _dbContext.LocationInventories
                    .Where(li => li.LocationId == locationId && li.ItemMasterId == itemMasterId)
                    .FirstOrDefaultAsync();

                return locationInventory;

            }
            catch (Exception)
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
        public async Task UpdateEmptyLocationInventoryStockInHand(int locationId, int itemMasterId,LocationInventory locationInventory, string operation)
        {
            try
            {
                var existLocationInventory = await _dbContext.LocationInventories.Where(li =>
                        li.LocationId == locationId && li.ItemMasterId == itemMasterId)
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

        public async Task<IEnumerable<LocationInventory>> GetItemLocationInventoriesByLocationId(int locationId)
        {
            return await _dbContext.LocationInventories
                .Where(li => li.LocationId == locationId)
                .Include(li => li.ItemMaster)
                .Include(li => li.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                .ToListAsync();
        }

        public async Task<IEnumerable<LocationInventory>> GetLocationInventoryByBatchId(int batchId)
        {
            try
            {
                var locationInventories = await _dbContext.LocationInventories
                    .Where(li => li.BatchId == batchId)
                    .Include(li => li.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(li => li.Location)
                    .ToListAsync();

                return locationInventories.Any() ? locationInventories : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<LocationInventorySummary> GetSumLocationInventoriesByLocationIdItemMasterId(int? locationId, int itemMasterId)
        {
            try
            {
                var query = _dbContext.LocationInventories
                    .Where(li => li.ItemMasterId == itemMasterId)
                    .Include(li => li.ItemMaster)
                    .AsQueryable();

                // Apply locationId filter if provided
                if (locationId.HasValue)
                {
                    query = query.Where(li => li.LocationId == locationId.Value);
                }

                var summaryData = await query
                    .GroupBy(li => new { li.LocationId, li.ItemMasterId })
                    .Select(g => new LocationInventorySummary
                    {
                        LocationInventoryId = g.FirstOrDefault().LocationInventoryId,
                        LocationId = g.Key.LocationId,
                        ItemMasterId = g.Key.ItemMasterId,
                        TotalStockInHand = g.Sum(li => li.StockInHand ?? 0),
                        MinReOrderLevel = g.Min(li => li.ReOrderLevel ?? 0),
                        MaxStockLevel = g.Max(li => li.MaxStockLevel ?? 0),
                        ItemMaster = g.FirstOrDefault().ItemMaster
                    })
                    .FirstOrDefaultAsync();

                return summaryData ?? new LocationInventorySummary
                {
                    LocationInventoryId = 0,
                    LocationId = locationId ?? 0,
                    ItemMasterId = itemMasterId,
                    TotalStockInHand = 0,
                    MinReOrderLevel = 0,
                    MaxStockLevel = 0,
                    ItemMaster = null
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<LocationInventorySummary>> GetLowStockItems(int? supplierId = null, int? locationId = null)
        {
            try
            {
                // Step 1: Fetch SupoplierItems with ItemMasters
                var query = _dbContext.SupplierItems
                    .Include(si => si.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(si => si.ItemMaster)
                    .ThenInclude(im => im.Category)
                    .Include(si => si.ItemMaster)
                    .ThenInclude(im => im.ItemType)
                    .AsQueryable();

                if (supplierId.HasValue)
                {
                    query = query.Where(si => si.SupplierId == supplierId.Value);
                }

                var supplierItems = await query.ToListAsync();

                // If no items found for supplier, return empty list
                if (!supplierItems.Any())
                {
                    return new List<LocationInventorySummary>();
                }

                // Step 2: Fetch relevant LocationInventories
                // We want inventories for these items, filtering by locationId if provided.
                var itemMasterIds = supplierItems.Select(si => si.ItemMasterId).ToList();
                
                var inventoryQuery = _dbContext.LocationInventories
                    .Where(li => itemMasterIds.Contains(li.ItemMasterId));

                if (locationId.HasValue)
                {
                    inventoryQuery = inventoryQuery.Where(li => li.LocationId == locationId.Value);
                }

                var locationInventories = await inventoryQuery.ToListAsync();


                // Step 3: In-memory Left Join (GroupJoin)
                // We want ALL supplierItems, joined with matching locationInventories (if any)
                var summaryData = supplierItems
                    .GroupJoin(
                        locationInventories,
                        si => si.ItemMasterId,
                        li => li.ItemMasterId,
                        (si, liGroup) => new { SupplierItem = si, LocationInventories = liGroup }
                    )
                    .SelectMany(
                        x => x.LocationInventories.DefaultIfEmpty(), // This acts as Left Join
                        (x, li) => new { x.SupplierItem, LocationInventory = li }
                    )
                    .GroupBy(x => x.SupplierItem.ItemMasterId)
                    .Select(g => new LocationInventorySummary
                    {
                        LocationInventoryId = g.First().LocationInventory != null ? g.First().LocationInventory.LocationInventoryId : 0,
                        LocationId = locationId ?? (g.First().LocationInventory?.LocationId ?? 0), 
                        ItemMasterId = g.Key,
                        TotalStockInHand = g.Sum(x => x.LocationInventory != null ? x.LocationInventory.StockInHand ?? 0 : 0),
                        MinReOrderLevel = g.Min(x => x.LocationInventory != null ? x.LocationInventory.ReOrderLevel ?? 0 : 0),
                        MaxStockLevel = g.Max(x => x.LocationInventory != null ? x.LocationInventory.MaxStockLevel ?? 0 : 0),
                        ItemMaster = g.First().SupplierItem.ItemMaster
                    })
                    //.Where(s => s.TotalStockInHand < s.MaxStockLevel || s.MaxStockLevel == 0) // Commented out as per original code
                    .ToList();

                return summaryData;
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving low stock items", ex);
            }
        }

        //public async Task<IEnumerable<LocationInventorySummary>> GetSumLocationInventoriesByItemName(int? locationId, string itemName)
        //{
        //    try
        //    {
        //        // Declare summaryData at method scope
        //        List<LocationInventorySummary> summaryData;

        //        // Start with SupplierItem to get ItemMasters
        //        var supplierItemsQuery = _dbContext.SupplierItems
        //            .Include(si => si.ItemMaster)
        //            .ThenInclude(im => im.Unit)
        //            .Include(si => si.ItemMaster)
        //            .ThenInclude(im => im.Category)
        //            .Include(si => si.ItemMaster)
        //            .ThenInclude(im => im.ItemType)
        //            .Where(si => !string.IsNullOrEmpty(itemName) && si.ItemMaster.ItemName.Contains(itemName))
        //            .AsQueryable();

        //        var supplierItems = await supplierItemsQuery.ToListAsync();

        //        // Dynamic inventoryQuery to handle both cases
        //        var inventoryQuery = supplierItems.Any()
        //            ? from si in supplierItems
        //              join li in _dbContext.LocationInventories
        //                  on si.ItemMasterId equals li.ItemMasterId into liGroup
        //              from li in liGroup.DefaultIfEmpty()
        //              where li == null || li.LocationId == (locationId ?? li.LocationId)
        //              select new { ItemMaster = si.ItemMaster, LocationInventory = li }
        //            : from im in _dbContext.ItemMasters
        //                  .Include(im => im.Unit)
        //                  .Include(im => im.Category)
        //                  .Include(im => im.ItemType)
        //                  .Where(im => (!string.IsNullOrEmpty(itemName) && im.ItemName.Contains(itemName)) && im.IsInventoryItem == true)
        //              join li in _dbContext.LocationInventories
        //                  on im.ItemMasterId equals li.ItemMasterId into liGroup
        //              from li in liGroup.DefaultIfEmpty()
        //              where li == null || li.LocationId == (locationId ?? li.LocationId)
        //              select new { ItemMaster = im, LocationInventory = li };

        //        // Group and aggregate
        //        summaryData = inventoryQuery
        //            .GroupBy(x => new { LocationId = x.LocationInventory != null ? x.LocationInventory.LocationId : 0, x.ItemMaster.ItemMasterId })
        //            .Select(g => new LocationInventorySummary
        //            {
        //                LocationInventoryId = g.FirstOrDefault()?.LocationInventory?.LocationInventoryId ?? 0,
        //                LocationId = g.Key.LocationId,
        //                ItemMasterId = g.Key.ItemMasterId,
        //                TotalStockInHand = g.Sum(x => x.LocationInventory != null ? x.LocationInventory.StockInHand ?? 0 : 0),
        //                MinReOrderLevel = g.Min(x => x.LocationInventory != null ? x.LocationInventory.ReOrderLevel ?? 0 : 0),
        //                MaxStockLevel = g.Max(x => x.LocationInventory != null ? x.LocationInventory.MaxStockLevel ?? 0 : 0),
        //                ItemMaster = g.First().ItemMaster
        //            })
        //            .ToList();

        //        return summaryData.Any() ? summaryData : new List<LocationInventorySummary>();
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}
        public async Task<IEnumerable<LocationInventorySummary>> GetSumLocationInventoriesByItemName(int? locationId, string itemName, int? supplierId = null)
        {
            try
            {
                var lowerItemName = itemName?.ToLower();
                IQueryable<ItemMaster> itemQuery;

                if (supplierId.HasValue)
                {
                    // Prioritize SupplierItems if supplierId is provided
                    itemQuery = _dbContext.SupplierItems
                        .Where(si => si.SupplierId == supplierId.Value)
                        .Select(si => si.ItemMaster)
                        .Where(im => im.IsInventoryItem == true &&
                                    (!string.IsNullOrEmpty(lowerItemName) &&
                                     (im.ItemName.ToLower().Contains(lowerItemName) || im.ItemCode.ToLower().Contains(lowerItemName))))
                        .Include(im => im.Unit)
                        .Include(im => im.Category)
                        .Include(im => im.ItemType);
                }
                else
                {
                    // Prioritize ItemMaster if supplierId is NOT provided
                    itemQuery = _dbContext.ItemMasters
                        .Where(im => im.IsInventoryItem == true &&
                                    (!string.IsNullOrEmpty(lowerItemName) &&
                                     (im.ItemName.ToLower().Contains(lowerItemName) || im.ItemCode.ToLower().Contains(lowerItemName))))
                        .Include(im => im.Unit)
                        .Include(im => im.Category)
                        .Include(im => im.ItemType);
                }

                var items = await itemQuery.ToListAsync();

                if (!items.Any())
                {
                    return new List<LocationInventorySummary>();
                }

                var itemMasterIds = items.Select(im => im.ItemMasterId).ToList();

                // Fetch LocationInventories for these items
                var inventoryQuery = _dbContext.LocationInventories
                    .Where(li => itemMasterIds.Contains(li.ItemMasterId));

                if (locationId.HasValue)
                {
                    inventoryQuery = inventoryQuery.Where(li => li.LocationId == locationId.Value);
                }

                var inventories = await inventoryQuery.ToListAsync();

                // Left Join in-memory to ensure all searched items are returned
                var summaryData = items.GroupJoin(
                    inventories,
                    im => im.ItemMasterId,
                    li => li.ItemMasterId,
                    (im, liGroup) => new LocationInventorySummary
                    {
                        LocationInventoryId = liGroup.FirstOrDefault()?.LocationInventoryId ?? 0,
                        LocationId = locationId ?? 0,
                        ItemMasterId = im.ItemMasterId,
                        TotalStockInHand = liGroup.Sum(li => li.StockInHand ?? 0),
                        MinReOrderLevel = liGroup.Any() ? liGroup.Min(li => li.ReOrderLevel ?? 0) : 0,
                        MaxStockLevel = liGroup.Any() ? liGroup.Max(li => li.MaxStockLevel ?? 0) : 0,
                        ItemMaster = im
                    })
                    .ToList();

                return summaryData;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<LocationInventorySummary>> GetLowStockItemsByLocationOnly(int locationId)
        {
            try
            {
                var summaryData = await _dbContext.LocationInventories
                    .Include(li => li.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(li => li.ItemMaster)
                    .ThenInclude(im => im.Category)
                    .Include(li => li.ItemMaster)
                    .ThenInclude(im => im.ItemType)
                    .Where(li => li.LocationId == locationId)
                    .GroupBy(li => li.ItemMasterId)
                    .Select(g => new LocationInventorySummary
                    {
                        LocationInventoryId = g.First().LocationInventoryId,
                        LocationId = locationId,
                        ItemMasterId = g.Key,
                        TotalStockInHand = g.Sum(li => li.StockInHand ?? 0),
                        MinReOrderLevel = g.Min(li => li.ReOrderLevel ?? 0),
                        MaxStockLevel = g.Max(li => li.MaxStockLevel ?? 0),
                        ItemMaster = g.First().ItemMaster
                    })
                    //.Where(s => s.TotalStockInHand < s.MaxStockLevel || s.MaxStockLevel == 0)
                    .ToListAsync();

                return summaryData.Any() ? summaryData : new List<LocationInventorySummary>();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving low stock items by location", ex);
            }
        }

        public async Task ReduceInventoryByFIFO(int locationId, int itemMasterId, int transactionTypeId, decimal quantity)
        {
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
                    // Check if the item is a service item
                    var itemMaster = await _dbContext.ItemMasters
                        .Where(im => im.ItemMasterId == itemMasterId)
                        .FirstOrDefaultAsync();

                    if (itemMaster == null)
                    {
                        throw new InvalidOperationException($"ItemMaster with ID {itemMasterId} not found.");
                    }

                    if (itemMaster.IsInventoryItem == false)
                    {
                        // For service items, skip inventory checks and movements
                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
                        return;
                    }

                    // Existing logic for non-service items
                    var availableBatches = await _dbContext.LocationInventories
                        .Where(li => li.LocationId == locationId &&
                                    li.ItemMasterId == itemMasterId &&
                                    li.StockInHand > 0)
                        .Include(li => li.ItemBatch)
                        .OrderBy(li => li.BatchId) // FIFO by BatchId
                        .ToListAsync();

                    if (!availableBatches.Any())
                    {
                        throw new InvalidOperationException("No batches available for the specified location and item");
                    }

                    var totalAvailableStock = availableBatches.Sum(b => b.StockInHand ?? 0m);
                    if (totalAvailableStock < quantity)
                    {
                        throw new InvalidOperationException($"Insufficient stock. Available: {totalAvailableStock}, Requested: {quantity}");
                    }

                    decimal remainingQuantity = quantity;
                    foreach (var batch in availableBatches)
                    {
                        if (remainingQuantity <= 0) break;
                        decimal currentBatchStock = batch.StockInHand ?? 0m;
                        decimal quantityToReduce = Math.Min(remainingQuantity, currentBatchStock);

                        batch.StockInHand -= quantityToReduce;
                        remainingQuantity -= quantityToReduce;
                        _dbContext.LocationInventories.Update(batch);

                        var inventoryMovement = new LocationInventoryMovement
                        {
                            MovementTypeId = 2,
                            TransactionTypeId = transactionTypeId,
                            ItemMasterId = itemMasterId,
                            BatchId = batch.BatchId,
                            LocationId = locationId,
                            Date = DateTime.UtcNow,
                            Qty = quantityToReduce,
                        };
                        _dbContext.LocationInventoryMovements.Add(inventoryMovement);
                    }

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        public async Task<IEnumerable<LocationInventorySummary>> GetSumOfItemInventoryByLocationId(int locationId)
        {
            try
            {
                var summaryData = await _dbContext.LocationInventories
                    .Include(li => li.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(li => li.ItemMaster)
                    .ThenInclude(im => im.Category)
                    .Include(li => li.ItemMaster)
                    .ThenInclude(im => im.ItemType)
                    .Where(li => li.LocationId == locationId)
                    .GroupBy(li => li.ItemMasterId)
                    .Select(g => new LocationInventorySummary
                    {
                        LocationInventoryId = g.First().LocationInventoryId,
                        LocationId = locationId,
                        ItemMasterId = g.Key,
                        TotalStockInHand = g.Sum(li => li.StockInHand ?? 0),
                        MinReOrderLevel = g.Min(li => li.ReOrderLevel ?? 0),
                        MaxStockLevel = g.Max(li => li.MaxStockLevel ?? 0),
                        ItemMaster = g.First().ItemMaster
                    })
                    .Where(s => s.TotalStockInHand > 0)
                    .ToListAsync();

                return summaryData.Any() ? summaryData : new List<LocationInventorySummary>();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving low stock items by location", ex);
            }
        }

        public async Task UpdateReorderLevelMaxStockLevel(int locationId, int itemMasterId, LocationInventory locationInventory)
        {
            try
            {
                var existUserLocationInventories = await _dbContext.LocationInventories
                    .Where(li => li.LocationId == locationId && li.ItemMasterId == itemMasterId)
                    .ToListAsync();

                if (existUserLocationInventories != null && existUserLocationInventories.Any())
                {
                    foreach (var existUserLocationInventory in existUserLocationInventories)
                    {
                        existUserLocationInventory.ReOrderLevel = locationInventory.ReOrderLevel;
                        existUserLocationInventory.MaxStockLevel = locationInventory.MaxStockLevel;
                        _dbContext.Entry(existUserLocationInventory).State = EntityState.Modified;
                    }
                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    throw new InvalidOperationException($"No LocationInventory records found for LocationId {locationId} and ItemMasterId {itemMasterId}.");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<LocationInventorySummary> GetSumLocationInventoriesByLocationIdItemCode(int? locationId, string itemCode)
        {
            if (string.IsNullOrWhiteSpace(itemCode))
            {
                throw new ArgumentException("ItemCode is required.");
            }

            try
            {
                var query = from li in _dbContext.LocationInventories
                            join im in _dbContext.ItemMasters
                                on li.ItemMasterId equals im.ItemMasterId
                            where im.ItemCode == itemCode
                            select new { li, im };

                // Apply location filter if provided
                if (locationId.HasValue)
                {
                    query = query.Where(x => x.li.LocationId == locationId.Value);
                }

                var summaryData = await query
                    .GroupBy(x => new { x.li.LocationId, x.im.ItemMasterId })
                    .Select(g => new LocationInventorySummary
                    {
                        LocationInventoryId = g.First().li.LocationInventoryId, // or 0 if no record
                        LocationId = g.Key.LocationId,
                        ItemMasterId = g.Key.ItemMasterId,
                        TotalStockInHand = g.Sum(x => x.li.StockInHand ?? 0),
                        MinReOrderLevel = g.Min(x => x.li.ReOrderLevel ?? 0),
                        MaxStockLevel = g.Max(x => x.li.MaxStockLevel ?? 0),
                        ItemMaster = g.First().im
                    })
                    .FirstOrDefaultAsync();

                // If no data found, return a default object with ItemMaster details (if item exists)
                if (summaryData == null)
                {
                    var itemMaster = await _dbContext.ItemMasters
                        .FirstOrDefaultAsync(im => im.ItemCode == itemCode);

                    return new LocationInventorySummary
                    {
                        LocationInventoryId = 0,
                        LocationId = locationId ?? 0,
                        ItemMasterId = itemMaster?.ItemMasterId ?? 0,
                        TotalStockInHand = 0,
                        MinReOrderLevel = 0,
                        MaxStockLevel = 0,
                        ItemMaster = itemMaster
                    };
                }

                return summaryData;
            }
            catch (Exception ex)
            {
                // Log the exception if you have a logger
                throw; // or wrap: throw new Exception("Error fetching inventory summary", ex);
            }
        }

        public async Task IncreaseInventoryByFIFO(int locationId, int itemMasterId, int transactionTypeId, decimal quantity, int? sourceLocationId = null)
        {
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
                    // Check if the item is a service item
                    var itemMaster = await _dbContext.ItemMasters
                        .Where(im => im.ItemMasterId == itemMasterId)
                        .FirstOrDefaultAsync();

                    if (itemMaster == null)
                    {
                        throw new InvalidOperationException($"ItemMaster with ID {itemMasterId} not found.");
                    }

                    if (itemMaster.IsInventoryItem == false)
                    {
                        // For service items, skip inventory checks and movements
                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
                        return;
                    }

                    // Get existing inventory at destination location
                    var existingBatch = await _dbContext.LocationInventories
                        .Where(li => li.LocationId == locationId &&
                                    li.ItemMasterId == itemMasterId)
                        .OrderBy(li => li.BatchId) // FIFO by BatchId
                        .FirstOrDefaultAsync();

                    int batchIdToUse;

                    if (existingBatch != null)
                    {
                        // Use the existing batch (FIFO - first batch)
                        batchIdToUse = existingBatch.BatchId.Value;
                        existingBatch.StockInHand = (existingBatch.StockInHand ?? 0m) + quantity;
                        _dbContext.LocationInventories.Update(existingBatch);
                    }
                    else
                    {
                        // No inventory at destination - get batch from source location
                        if (sourceLocationId == null)
                        {
                            throw new InvalidOperationException("Source location is required when no inventory exists at the destination location.");
                        }

                        var sourceBatch = await _dbContext.LocationInventories
                            .Where(li => li.LocationId == sourceLocationId.Value &&
                                        li.ItemMasterId == itemMasterId)
                            .OrderBy(li => li.BatchId) // FIFO by BatchId
                            .FirstOrDefaultAsync();

                        if (sourceBatch == null)
                        {
                            throw new InvalidOperationException($"No batches found for item {itemMasterId} in source location {sourceLocationId}.");
                        }

                        batchIdToUse = sourceBatch.BatchId.Value;

                        // Create new inventory record at destination location
                        var newInventory = new LocationInventory
                        {
                            LocationId = locationId,
                            ItemMasterId = itemMasterId,
                            BatchId = batchIdToUse,
                            StockInHand = quantity
                        };
                        _dbContext.LocationInventories.Add(newInventory);
                    }

                    // Record the inventory movement
                    var inventoryMovement = new LocationInventoryMovement
                    {
                        MovementTypeId = 1,
                        TransactionTypeId = transactionTypeId,
                        ItemMasterId = itemMasterId,
                        BatchId = batchIdToUse,
                        LocationId = locationId,
                        Date = DateTime.UtcNow,
                        Qty = quantity,
                    };
                    _dbContext.LocationInventoryMovements.Add(inventoryMovement);

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        public async Task StockAdjustment(int locationInventoryId, decimal quantity)
        {
            var strategy = _dbContext.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () => 
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
                    var inventory = await _dbContext.LocationInventories
                        .Where(li => li.LocationInventoryId == locationInventoryId)
                        .FirstOrDefaultAsync();

                    if (inventory == null)
                    {
                        throw new InvalidOperationException($"Location inventory with ID {locationInventoryId} not found.");
                    }

                    decimal currentStock = inventory.StockInHand ?? 0;
                    decimal adjustmentQty = quantity - currentStock;

                    if (adjustmentQty == 0)
                    {
                        // No adjustment needed if values are the same
                        return;
                    }

                    // Set the quantity passed from request to the StockInHand
                    inventory.StockInHand = quantity;
                    _dbContext.LocationInventories.Update(inventory);

                    // Determine MovementTypeId and TransactionTypeId
                    int derivedMovementTypeId;
                    string transactionTypeName;

                    if (adjustmentQty > 0)
                    {
                        derivedMovementTypeId = 1;
                        transactionTypeName = "Stock Adjustment In";
                    }
                    else
                    {
                        derivedMovementTypeId = 2;
                        transactionTypeName = "Stock Adjustment Out";
                    }

                    var transactionType = await _dbContext.TransactionTypes
                        .FirstOrDefaultAsync(tt => tt.Name == transactionTypeName);
                    if (transactionType == null)
                    {
                        throw new InvalidOperationException($"Transaction Type '{transactionTypeName}' not found.");
                    }

                    // Create LocationInventoryMovement
                    var inventoryMovement = new LocationInventoryMovement
                    {
                        MovementTypeId = derivedMovementTypeId,
                        TransactionTypeId = transactionType.TransactionTypeId,
                        ItemMasterId = inventory.ItemMasterId,
                        BatchId = inventory.BatchId,
                        LocationId = inventory.LocationId,
                        Date = DateTime.UtcNow,
                        Qty = Math.Abs(adjustmentQty),
                    };
                    _dbContext.LocationInventoryMovements.Add(inventoryMovement);

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        public async Task IncreaseInventoryByFIFOInternal(int locationId, int itemMasterId, int transactionTypeId, decimal quantity, int? sourceLocationId = null)
        {
            try
            {
                // Check if the item is a service item
                var itemMaster = await _dbContext.ItemMasters
                    .Where(im => im.ItemMasterId == itemMasterId)
                    .FirstOrDefaultAsync();

                if (itemMaster == null)
                {
                    throw new InvalidOperationException($"ItemMaster with ID {itemMasterId} not found.");
                }

                if (itemMaster.IsInventoryItem == false)
                {
                    // For service items, skip inventory checks and movements
                    await _dbContext.SaveChangesAsync();
                    return;
                }

                // Get existing inventory at destination location
                var existingBatch = await _dbContext.LocationInventories
                    .Where(li => li.LocationId == locationId &&
                                li.ItemMasterId == itemMasterId)
                    .OrderBy(li => li.BatchId) // FIFO by BatchId
                    .FirstOrDefaultAsync();

                int batchIdToUse;

                if (existingBatch != null)
                {
                    // Use the existing batch (FIFO - first batch)
                    batchIdToUse = existingBatch.BatchId.Value;
                    existingBatch.StockInHand = (existingBatch.StockInHand ?? 0m) + quantity;
                    _dbContext.LocationInventories.Update(existingBatch);
                }
                else
                {
                    // No inventory at destination - get batch from source location
                    if (sourceLocationId == null)
                    {
                        throw new InvalidOperationException("Source location is required when no inventory exists at the destination location.");
                    }

                    var sourceBatch = await _dbContext.LocationInventories
                        .Where(li => li.LocationId == sourceLocationId.Value &&
                                    li.ItemMasterId == itemMasterId)
                        .OrderBy(li => li.BatchId) // FIFO by BatchId
                        .FirstOrDefaultAsync();

                    if (sourceBatch == null)
                    {
                        throw new InvalidOperationException($"No batches found for item {itemMasterId} in source location {sourceLocationId}.");
                    }

                    batchIdToUse = sourceBatch.BatchId.Value;

                    // Create new inventory record at destination location
                    var newInventory = new LocationInventory
                    {
                        LocationId = locationId,
                        ItemMasterId = itemMasterId,
                        BatchId = batchIdToUse,
                        StockInHand = quantity
                    };
                    _dbContext.LocationInventories.Add(newInventory);
                }

                // Record the inventory movement
                var inventoryMovement = new LocationInventoryMovement
                {
                    MovementTypeId = 1,
                    TransactionTypeId = transactionTypeId,
                    ItemMasterId = itemMasterId,
                    BatchId = batchIdToUse,
                    LocationId = locationId,
                    Date = DateTime.UtcNow,
                    Qty = quantity,
                };
                _dbContext.LocationInventoryMovements.Add(inventoryMovement);

                //await _dbContext.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }
    }
}
