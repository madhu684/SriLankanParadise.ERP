using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class GrnDetailRepository : IGrnDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public GrnDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddGrnDetail(GrnDetail grnDetail)
        {
            try
            {
                _dbContext.GrnDetails.Add(grnDetail);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
