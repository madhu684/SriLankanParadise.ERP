using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ItemPriceMasterRepository : IItemPriceMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ItemPriceMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddItemPriceMaster(ItemPriceMaster itemPriceMaster)
        {
            try
            {
                _dbContext.ItemPriceMasters.Add(itemPriceMaster);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<ItemPriceMaster>> GetItemPriceMasterByCompanyId(int companyId)
        {
            try
            {
                var itemPriceMasters = await _dbContext.ItemPriceMasters
                    .Where(ipm => ipm.CompanyId == companyId)
                    .Include(ipm => ipm.ItemPriceDetails)
                    .ToListAsync();

                return itemPriceMasters.Any() ? itemPriceMasters : null!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ItemPriceMaster> GetItemPriceMasterById(int id)
        {
            try
            {
                var itemPriceMaster = await _dbContext.ItemPriceMasters
                    .Include(ipm => ipm.ItemPriceDetails)
                    .FirstOrDefaultAsync(ipm => ipm.Id == id);

                return itemPriceMaster!;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
