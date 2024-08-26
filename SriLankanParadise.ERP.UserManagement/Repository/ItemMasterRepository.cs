using Microsoft.EntityFrameworkCore;
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
                    .Where(im => im.Status == true && im.CompanyId == companyId)
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
                var itemMastersTemp = await query.ToListAsync();

                // Process itemType to handle multiple types separated by commas
                if (!string.IsNullOrEmpty(itemType) && itemType.ToUpper() != "ALL")
                {
                    string[] itemTypes = itemType.Split(',')
                                                 .Select(it => it.Trim())
                                                 .ToArray();

                    query = query.Include(im => im.Category)
                        .Include(im => im.Unit)
                        .ThenInclude(u => u.MeasurementType)
                        .Include(im => im.ItemType)
                        .Include(im => im.InventoryUnit)
                        .ThenInclude(u => u.MeasurementType)
                        .Where(im => itemTypes.Contains(im.ItemType.Name));
                }
                else
                {
                    query = query.Include(im => im.Category)
                        .Include(im => im.Unit)
                        .ThenInclude(u => u.MeasurementType)
                        .Include(im => im.ItemType)
                        .Include(im => im.InventoryUnit)
                        .ThenInclude(u => u.MeasurementType);
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
    }
}
