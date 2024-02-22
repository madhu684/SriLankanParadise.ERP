using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class LocationChannelItemBatchRepository : ILocationChannelItemBatchRepository
    {
        private readonly ErpSystemContext _dbContext;

        public LocationChannelItemBatchRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddLocationChannelItemBatch(LocationChannelItemBatch locationChannelItemBatch)
        {
            try
            {
                _dbContext.LocationChannelItemBatches.Add(locationChannelItemBatch);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
