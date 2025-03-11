using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SubItemMasterRepository : ISubItemMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SubItemMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddSubItemMaster(SubItemMaster subItemMaster)
        {
            try
            {
                _dbContext.SubItemMasters.Add(subItemMaster);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SubItemMaster>> GetSubItemMastersByItemMasterId(int itemMasterId)
        {
            try
            {
                var subItemMasters = await _dbContext.SubItemMasters
                    .Where(x => x.MainItemMasterId == itemMasterId)
                    .Include(x => x.ItemMaster)
                    .ToListAsync();

                return subItemMasters;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteSubItemMastersByMainItemMasterId(int mainItemMasterId)
        {
            try
            {
                var subItemMasters = await _dbContext.SubItemMasters
                    .Where(x => x.MainItemMasterId == mainItemMasterId)
                    .ToListAsync();

                if (subItemMasters != null)
                {
                    _dbContext.SubItemMasters.RemoveRange(subItemMasters);
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
