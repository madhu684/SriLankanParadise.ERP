using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
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

        //public async Task AddItemBatch(ItemBatch itemBatch)
        //{
        //    try
        //    {
        //        _dbContext.ItemBatches.Add(itemBatch);
        //        await _dbContext.SaveChangesAsync();

        //    }
        //    catch (Exception ex)
        //    {

        //        throw;
        //    }
        //}
        public async Task AddItemBatch(ItemBatch itemBatch)
        {
            try
            {
                var existingBatch = await _dbContext.ItemBatches
                    .FirstOrDefaultAsync(ib => ib.BatchId == itemBatch.BatchId && ib.ItemMasterId == itemBatch.ItemMasterId);

                if (existingBatch != null)
                {
                    // Do not add new item batch if BatchId and ItemMasterId already exist
                    return;
                }

                _dbContext.ItemBatches.Add(itemBatch);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
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
                    .Include(ib => ib.ItemMaster)
                    .ToListAsync();

                return itemBatches.Any() ? itemBatches : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<ItemBatch> GetItemBatchByBatchIdAndItemMasterId(int batchId, int itemMasterId)
        {
            try
            {
                var itemBatch = await _dbContext.ItemBatches
                    .Where(ib => ib.BatchId == batchId && ib.ItemMasterId == itemMasterId)
                    .FirstOrDefaultAsync();

                return itemBatch;
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

        public async Task<IEnumerable<ItemBatch>> GetItemBatchesByItemMasterId(int itemMasterId, int companyId)
        {
            try
            {
                var itemBatches = await _dbContext.ItemBatches
                    .Where(ib => ib.ItemMasterId == itemMasterId && ib.CompanyId == companyId)
                    .Include(ib => ib.Batch)
                    .Include(ib => ib.ItemMaster)
                    .ToListAsync();

                return itemBatches.Any() ? itemBatches : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task UpdateItemBatch(int batchId, int itemMasterId, ItemBatch itemBatch)
        {
            try
            {
                var existItemBatch = await _dbContext.ItemBatches.FindAsync(batchId, itemMasterId);

                if (existItemBatch != null)
                {
                    _dbContext.Entry(existItemBatch).CurrentValues.SetValues(itemBatch);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task UpdateItemBatchQty(int batchId, int itemMasterId, ItemBatch itemBatch, string operation)
        {
            var existItemBatch = await _dbContext.ItemBatches.FindAsync(batchId, itemMasterId);
            if (existItemBatch != null)
            {
                if (operation.ToLower() == "set")
                {
                    existItemBatch.Qty = itemBatch.Qty;
                }
                else if (operation.ToLower() == "add")
                {
                    existItemBatch.Qty += itemBatch.Qty;
                }
                else if (operation.ToLower() == "subtract")
                {
                    existItemBatch.Qty -= itemBatch.Qty;
                }

                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<ItemBatch>> GetItemBatchesByLocationIdCompanyId(int locationId, int companyId)
        {
            try
            {
                var itemBatches = await _dbContext.ItemBatches
                    .Where(ib => ib.Status == true && ib.CompanyId == companyId && ib.LocationId == locationId)
                    .Include(ib => ib.Batch)
                    .Include(ib => ib.ItemMaster)
                    .ToListAsync();

                return itemBatches.Any() ? itemBatches : null;
            }
            catch (Exception)
            {

                throw;
            };
        }

        public async Task<ItemBatch> GetItemBatchByItemMasterIdBatchId(int itemMasterId, int batchId)
        {
            try
            {
                var itemBatch = await _dbContext.ItemBatches
                    .Where(ib => ib.ItemMasterId == itemMasterId && ib.BatchId == batchId)
                    .FirstOrDefaultAsync();

                return itemBatch != null ? itemBatch : null!;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
