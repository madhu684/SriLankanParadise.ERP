using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ItemMasterRepository : IItemMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ItemMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        //public async Task AddItemMaster(ItemMaster itemMaster)
        //{
        //    try
        //    {
        //        if (itemMaster == null)
        //        {
        //            throw new ArgumentNullException(nameof(itemMaster), "ItemMaster cannot be null.");
        //        }

        //        // Trim whitespace from inputs
        //        itemMaster.ItemName = itemMaster.ItemName?.Trim();
        //        itemMaster.ItemCode = itemMaster.ItemCode?.Trim();

        //        // Normalize the item name once (remove spaces, lowercase)
        //        var normalizedItemName = itemMaster.ItemName?.Replace(" ", "").ToLower();

        //        // Check for duplicate name (null-safe)
        //        if (!string.IsNullOrWhiteSpace(normalizedItemName))
        //        {
        //            var nameExists = await _dbContext.ItemMasters
        //                .AnyAsync(im => im.ItemName != null &&
        //                               im.ItemName.Replace(" ", "").ToLower() == normalizedItemName);

        //            if (nameExists)
        //            {
        //                throw new InvalidOperationException("An item with the same name already exists.");
        //            }
        //        }

        //        // Normalize the item code once (trimmed, lowercase)
        //        var normalizedCode = itemMaster.ItemCode?.Trim().ToLower();

        //        // Check for duplicate code (null-safe, trimmed, case-insensitive)
        //        if (!string.IsNullOrWhiteSpace(normalizedCode))
        //        {
        //            var codeExists = await _dbContext.ItemMasters
        //                .AnyAsync(im => im.ItemCode != null &&
        //                               im.ItemCode.Trim().ToLower() == normalizedCode);

        //            if (codeExists)
        //            {
        //                throw new InvalidOperationException("An item with the same code already exists.");
        //            }
        //        }

        //        _dbContext.ItemMasters.Add(itemMaster);
        //        await _dbContext.SaveChangesAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}
        public async Task AddItemMaster(ItemMaster itemMaster)
        {
            try
            {
                if (itemMaster == null)
                    throw new ArgumentNullException(nameof(itemMaster), "ItemMaster cannot be null.");

                itemMaster.ItemName = itemMaster.ItemName?.Trim();
                itemMaster.ItemCode = itemMaster.ItemCode?.Trim();

                var normalizedItemName = itemMaster.ItemName?.Replace(" ", "").ToLower();
                var normalizedItemCode = itemMaster.ItemCode?.Replace(" ", "").ToLower();

                if (!string.IsNullOrWhiteSpace(normalizedItemName))
                {
                    bool nameExists = await _dbContext.ItemMasters
                        .AnyAsync(im => im.ItemName != null &&
                                        im.ItemName.Replace(" ", "").ToLower() == normalizedItemName);
                    if (nameExists)
                        throw new InvalidOperationException($"An item with the name '{itemMaster.ItemName}' already exists.");
                }

                if (!string.IsNullOrWhiteSpace(normalizedItemCode))
                {
                    bool codeExists = await _dbContext.ItemMasters
                        .AnyAsync(im => im.ItemCode != null &&
                                        im.ItemCode.Replace(" ", "").ToLower() == normalizedItemCode);
                    if (codeExists)
                        throw new InvalidOperationException($"An item with the code '{itemMaster.ItemCode}' already exists.");
                }

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
                    .ToListAsync();

                return itemMasters.Any() ? itemMasters : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId, string searchQuery, string itemType)
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
                query = query.Where(im => im.ItemName.Contains(searchQuery));

                // Apply item type filter conditionally
                if (!string.IsNullOrEmpty(itemType) && itemType.ToUpper() != "ALL")
                {
                    query = query.Include(im => im.Category)
                        .Include(im => im.Unit)
                        .ThenInclude(u => u.MeasurementType)
                        .Include(im => im.ItemType)
                        .Include(im => im.InventoryUnit)
                        .ThenInclude(u => u.MeasurementType)
                        .Where(im => im.ItemType.Name == itemType && im.Status == true);
                }
                else
                {
                    query = query.Include(im => im.Category)
                        .Include(im => im.Unit)
                        .ThenInclude(u => u.MeasurementType)
                        .Include(im => im.ItemType)
                        .Include(im => im.InventoryUnit)
                        .ThenInclude(u => u.MeasurementType)
                        .Where(im => im.Status == true);

                }

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
                    .Include(im => im.SubItemMasters)
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
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

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByItemTypeId(int itemTypeId)
        {
            try
            {
                var itemMasters = await _dbContext.ItemMasters
                    .Where(im => im.Status == true && im.ItemTypeId == itemTypeId)
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
                    .ThenInclude(u => u.MeasurementType)
                    .Include(im => im.ItemType)
                    .Include(im => im.InventoryUnit)
                    .ThenInclude(u => u.MeasurementType)
                    .ToListAsync();

                return itemMasters.Any() ? itemMasters : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersWithSameParentItemMasterByItemMasterId(int itemMasterId)
        {
            try
            {
                var parentItemMasterId = await _dbContext.ItemMasters
                    .Where(im => im.ItemMasterId == itemMasterId)
                    .Select(im => im.ParentId)
                    .FirstOrDefaultAsync();

                if (parentItemMasterId == null)
                {
                    return Enumerable.Empty<ItemMaster>();
                }

                var itemMastersWithSameParent = await _dbContext.ItemMasters
                    .Where(im => im.ParentId == parentItemMasterId && im.ItemMasterId != itemMasterId && im.ItemMasterId != parentItemMasterId)
                    .ToListAsync();

                return itemMastersWithSameParent.Any() ? itemMastersWithSameParent : null;
            }
            catch (Exception) {
                throw;
            }
        }

        public async Task ActiveDeactiveItemMaster(int itemMasterId, ItemMaster itemMaster)
        {
            try
            {
                var item = await _dbContext.ItemMasters.FindAsync(itemMasterId);
                if (item != null)
                {
                    item.Status = itemMaster.Status;
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch
            {
                throw;
            }
        }


        // Helper Function
        private static string NormalizeString(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return null;

            return new string(input
                .Where(c => !char.IsWhiteSpace(c))
                .ToArray())
                .ToLowerInvariant();
        }
    }
}
