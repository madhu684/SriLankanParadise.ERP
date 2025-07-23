using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class BatchHasGrnMasterRepository : IBatchHasGrnMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public BatchHasGrnMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddBatchHasGrnMaster(BatchHasGrnMaster batchHasGrnMaster)
        {
            try
            {
                _dbContext.BatchHasGrnMasters.Add(batchHasGrnMaster);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
