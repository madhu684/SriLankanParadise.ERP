using Microsoft.EntityFrameworkCore;
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
    }
}
