using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ItemTypeRepository : IItemTypeRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ItemTypeRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddItemType(ItemType itemType)
        {
            try
            {
                _dbContext.ItemTypes.Add(itemType);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ItemType> GetItemTypeById(int itemTypeId)
        {
            try
            {
                var itemType = await _dbContext.ItemTypes
                    .Where(it => it.ItemTypeId == itemTypeId)
                    .FirstOrDefaultAsync();

                return itemType;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<ItemType>> GetItemTypesByCompanyId(int companyId)
        {
            try
            {
                var itemTypes = await _dbContext.ItemTypes
                    .Where(i => i.CompanyId == companyId)
                    .ToListAsync();

                return itemTypes.Any() ? itemTypes : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task UpdateItemType(int itemTypeId, ItemType itemType)
        {
            try
            {
                var existingItemType = await _dbContext.ItemTypes.FindAsync(itemTypeId);

                if (existingItemType != null)
                {
                    _dbContext.Entry(existingItemType).CurrentValues.SetValues(itemType);
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
