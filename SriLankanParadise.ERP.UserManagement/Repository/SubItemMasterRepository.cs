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
    }
}
