using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;
using System.ComponentModel.Design;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ItemMasterRepository : IItemMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ItemMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddItemMaster(ItemMaster itemMaster)
        {
            try
            {
                _dbContext.ItemMasters.Add(itemMaster);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ItemMaster>> GetAll()
        {
            try
            {
                return await _dbContext.ItemMasters
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.ItemMode)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId)
        {
            try
            {
                var itemMasters = await _dbContext.ItemMasters
                    .Where(im => im.CompanyId == companyId)
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.Supplier)
                    .Include(im => im.ItemMode)
                    .ToListAsync();

                return itemMasters;
            }
            catch (Exception)
            {

                throw;
            }
        }

        //public async Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId, string searchQuery, string itemType)
        //{
        //    try
        //    {
        //        // Check if searchQuery is provided
        //        if (string.IsNullOrEmpty(searchQuery))
        //        {
        //            return null;
        //        }

        //        var query = _dbContext.ItemMasters
        //            .Where(im => im.Status == true && im.CompanyId == companyId);

        //        // Apply search query
        //        query = query.Where(im => im.ItemName.Contains(searchQuery));
        //        var itemMastersTemp = await query.ToListAsync();

        //        // Process itemType to handle multiple types separated by commas
        //        if (!string.IsNullOrEmpty(itemType) && itemType.ToUpper() != "ALL")
        //        {
        //            string[] itemTypes = itemType.Split(',')
        //                                         .Select(it => it.Trim())
        //                                         .ToArray();

        //            query = query.Include(im => im.Category)
        //                .Include(im => im.Unit)
        //                .ThenInclude(u => u.MeasurementType)
        //                .Include(im => im.ItemType)
        //                .Include(im => im.InventoryUnit)
        //                .ThenInclude(u => u.MeasurementType)
        //                .Where(im => itemTypes.Contains(im.ItemType.Name));
        //        }
        //        else
        //        {
        //            query = query.Include(im => im.Category)
        //                .Include(im => im.Unit)
        //                .ThenInclude(u => u.MeasurementType)
        //                .Include(im => im.ItemType)
        //                .Include(im => im.InventoryUnit)
        //                .ThenInclude(u => u.MeasurementType);
        //        }

        //        var itemMasters = await query.ToListAsync();

        //        return itemMasters.Any() ? itemMasters : null;
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId, string searchQuery, bool isTreatment = false)
        {
            try
            {
                // Check if searchQuery is provided
                if (string.IsNullOrEmpty(searchQuery))
                {
                    return null;
                }

                var query = _dbContext.ItemMasters
                    .Where(im => im.Status == true && im.CompanyId == companyId);

                // Apply search query
                query = query.Where(im => im.ItemName.Contains(searchQuery) || im.ItemCode.Contains(searchQuery));

                // Apply isTreatment filter
                if (!isTreatment)
                {
                    query = query.Where(im => im.IsInventoryItem == true);
                }

                query = query.Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemMode);

                var itemMasters = await query.ToListAsync();
                return itemMasters.Any() ? itemMasters : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId)
        {
            try
            {
                var itemMaster = await _dbContext.ItemMasters
                    .Where(im => im.ItemMasterId == itemMasterId)
                    //.Include(im => im.SubItemMasters)
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.Supplier)
                    .Include(im => im.ItemMode)
                    .FirstOrDefaultAsync();

                return itemMaster;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateItemMaster(int itemMasterId, ItemMaster itemMaster)
        {
            try
            {
                var existItemMaster = await _dbContext.ItemMasters.FindAsync(itemMasterId);

                if (existItemMaster != null)
                {
                    itemMaster.ItemMasterId = existItemMaster.ItemMasterId;

                    _dbContext.Entry(existItemMaster).CurrentValues.SetValues(itemMaster);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteItemMaster(int itemMasterId)
        {
            try
            {
                var itemMaster = await _dbContext.ItemMasters.FindAsync(itemMasterId);

                if (itemMaster != null)
                {
                    _dbContext.ItemMasters.Remove(itemMaster);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByUserId(int userId)
        {
            try
            {
                var itemMasters = await _dbContext.ItemMasters
                    .Where(im => im.CreatedUserId == userId)
                    .Include(im => im.SubItemMasters)
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.Supplier)
                    .Include(im => im.ItemMode)
                    .ToListAsync();

                return itemMasters.Any() ? itemMasters : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ItemMaster>> GetSubItemsByItemMasterId(int itemMasterId)
        {
            try
            {
                var itemMasters = await _dbContext.ItemMasters
                    .Where(im => im.ItemMasterId != itemMasterId && im.ParentId == itemMasterId)
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.SubItemMasters)
                    .ToListAsync();

                return itemMasters.Any() ? itemMasters : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByItemMasterIds(int[] itemMasterIds)
        {
            try
            {
                var itemMaster = await _dbContext.ItemMasters
                    .Where(im => itemMasterIds.Contains(im.ItemMasterId))
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
                    .ToListAsync();

                return itemMaster;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SameCategoryTypeSupplierItemDto>> GetSupplierItemsByTypeAndCategory(int companyId, int itemTypeId, int categoryId, int locationId)
        {
            //try
            //{
            //    var items = await _dbContext.ItemMasters
            //        .Include(im => im.Supplier)
            //        .Include(im => im.Category)
            //        .Include(im => im.ItemType)
            //        .Where(im => im.Status == true
            //            && im.ItemTypeId == itemTypeId
            //            && im.CategoryId == categoryId
            //            && im.CompanyId == companyId
            //            && im.SupplierId != null)
            //        .Join(_dbContext.SupplierItems,
            //            im => im.ItemMasterId,
            //            si => si.ItemMasterId,
            //            (im, si) => new SameCategoryTypeSupplierItemDto
            //            {
            //                ItemMasterId = im.ItemMasterId,
            //                ItemName = im.ItemName,
            //                ItemCode = im.ItemCode,
            //                UnitPrice = im.UnitPrice,
            //                SellingPrice = im.SellingPrice,
            //                SupplierName = im.Supplier.SupplierName,
            //                CategoryName = im.Category.CategoryName,
            //                ItemTypeName = im.ItemType != null ? im.ItemType.Name : null
            //            })
            //        .ToListAsync();

            //    return items.Any() ? items : new List<SameCategoryTypeSupplierItemDto>();
            //}
            try
            {
                var items = await _dbContext.ItemMasters
                    .Include(im => im.Supplier)
                    .Include(im => im.Category)
                    .Include(im => im.ItemType)
                    .Include(im => im.Unit)
                    .Include(im => im.ItemMode)
                    .Where(im => im.Status == true
                        && im.ItemTypeId == itemTypeId
                        && im.CategoryId == categoryId
                        && im.CompanyId == companyId
                        && im.SupplierId != null)
                    .Join(_dbContext.SupplierItems,
                        im => im.ItemMasterId,
                        si => si.ItemMasterId,
                        (im, si) => new { ItemMaster = im, SupplierItem = si })
                    .GroupJoin(_dbContext.LocationInventories.Where(li => li.LocationId == locationId),
                        joined => joined.ItemMaster.ItemMasterId,
                        li => li.ItemMasterId,
                        (joined, locationInventories) => new { joined.ItemMaster, joined.SupplierItem, LocationInventory = locationInventories.FirstOrDefault() })
                    .Select(joined => new SameCategoryTypeSupplierItemDto
                    {
                        ItemMasterId = joined.ItemMaster.ItemMasterId,
                        ItemName = joined.ItemMaster.ItemName,
                        ItemCode = joined.ItemMaster.ItemCode,
                        UnitPrice = joined.ItemMaster.UnitPrice,
                        SellingPrice = joined.ItemMaster.SellingPrice,
                        SupplierName = joined.ItemMaster.Supplier.SupplierName,
                        CategoryName = joined.ItemMaster.Category.CategoryName,
                        ItemTypeName = joined.ItemMaster.ItemType != null ? joined.ItemMaster.ItemType.Name : null,
                        StockInHand = joined.LocationInventory != null ? joined.LocationInventory.StockInHand : 0,
                        UnitName = joined.ItemMaster.Unit != null ? joined.ItemMaster.Unit.UnitName : null
                    })
                    .ToListAsync();

                return items.Any() ? items : new List<SameCategoryTypeSupplierItemDto>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<ItemMaster>> SearchItemByCode(string searchTerm)
        {
            try
            {
                if (string.IsNullOrEmpty(searchTerm))
                {
                    return null;
                }

                // Apply search query
                var query = _dbContext.ItemMasters.Where(im => im.ItemCode.Contains(searchTerm));

                query = query.Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemMode);

                var itemMasters = await query.ToListAsync();
                return itemMasters.Any() ? itemMasters : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ItemMaster> GetItemMasterByItemCode(string itemCode, int companyId)
        {
            try
            {
                var itemMaster = await _dbContext.ItemMasters
                    .Where(im => im.ItemCode == itemCode && im.CompanyId == companyId && im.Status == true)
                    .FirstOrDefaultAsync();

                return itemMaster;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PagedResult<ItemMaster>> GetPaginatedItemMastersByCompanyId(
            int companyId,
            string? searchQuery = null,
            int? supplierId = null,
            int pageNumber = 1,
            int pageSize = 10)
        {
            try
            {
                // Input validation
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var query = _dbContext.ItemMasters
                    .AsNoTracking()
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.Supplier)
                    .Include(im => im.ItemMode)
                    .Where(im => im.CompanyId == companyId);


                // Apply search filter
                if (!string.IsNullOrEmpty(searchQuery))
                {
                    var searchTerm = searchQuery.ToLower().Trim();
                    query = query.Where(im =>
                        im.ItemName.ToLower().Contains(searchTerm) ||
                        im.ItemCode.ToLower().Contains(searchTerm)
                    );
                }

                // Apply supplier filter
                if (supplierId.HasValue)
                {
                    query = query.Where(im => im.SupplierId == supplierId.Value);
                }

                var totalCount = await query.CountAsync();

                // Apply pagination and ordering
                var items = await query
                    .OrderBy(cu => cu.ItemName)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<ItemMaster>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task ForceDeleteItemMaster(int itemMasterId)
        {
            try
            {
                var strategy = _dbContext.Database.CreateExecutionStrategy();

                await strategy.ExecuteAsync(async () =>
                {
                    using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            // 1. Delete LocationInventoryMovement entries with that itemMasterId
                            var inventoryMovements = await _dbContext.LocationInventoryMovements
                                .Where(lim => lim.ItemMasterId == itemMasterId)
                                .ToListAsync();

                            if (inventoryMovements.Any())
                            {
                                _dbContext.LocationInventoryMovements.RemoveRange(inventoryMovements);
                                await _dbContext.SaveChangesAsync();
                            }

                            // 2. Delete LocationInventory entries with that ItemMasterId
                            var locationInventories = await _dbContext.LocationInventories
                                .Where(li => li.ItemMasterId == itemMasterId)
                                .ToListAsync();

                            if (locationInventories.Any())
                            {
                                _dbContext.LocationInventories.RemoveRange(locationInventories);
                                await _dbContext.SaveChangesAsync();
                            }

                            // 3. Delete ItemBatch entry with that ItemMasterId
                            var itemBatches = await _dbContext.ItemBatches
                                .Where(ib => ib.ItemMasterId == itemMasterId)
                                .ToListAsync();

                            if (itemBatches.Any())
                            {
                                _dbContext.ItemBatches.RemoveRange(itemBatches);
                                await _dbContext.SaveChangesAsync();
                            }

                            // 4. Finally ItemMaster entry
                            var itemMaster = await _dbContext.ItemMasters.FindAsync(itemMasterId);

                            if (itemMaster != null)
                            {
                                _dbContext.ItemMasters.Remove(itemMaster);
                                await _dbContext.SaveChangesAsync();
                            }

                            await transaction.CommitAsync();
                        }
                        catch (Exception ex)
                        {
                            await transaction.RollbackAsync();
                            throw new Exception($"Error deleting item master with ID {itemMasterId}", ex);
                        }
                    }
                });
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
