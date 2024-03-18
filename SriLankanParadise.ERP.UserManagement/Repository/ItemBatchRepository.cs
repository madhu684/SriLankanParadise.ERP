using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ItemBatchRepository : IItemBatchRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ItemBatchRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddItemBatch(ItemBatch itemBatch)
        {
            try
            {
                _dbContext.ItemBatches.Add(itemBatch);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ItemBatch>> GetAll()
        {
            try
            {
                return await _dbContext.ItemBatches
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<ItemBatch>> GetItemBatchesByCompanyId(int companyId)
        {
            try
            {
                var itemBatches = await _dbContext.ItemBatches
                    .Where(ib => ib.Status == true && ib.CompanyId == companyId)
                    .Include(ib => ib.Batch)
                    .ToListAsync();

                return itemBatches.Any() ? itemBatches : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        /*public async Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId)
        {
            try
            {
                var itemMaster = await _dbContext.ItemMasters
                    .Where(im => im.ItemMasterId == itemMasterId)
                    .Include(im => im.Category)
                    .Include(im => im.Unit)
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
        }*/

        public async Task<IEnumerable<ItemBatch>> GetItemBatchesByUserId(int userId)
        {
            try
            {
                var itemMasters = await _dbContext.ItemBatches
                    .Where(ib => ib.CreatedUserId == userId)
                    .Include(ib => ib.Batch)
                    .ToListAsync();

                return itemMasters.Any() ? itemMasters : null;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
