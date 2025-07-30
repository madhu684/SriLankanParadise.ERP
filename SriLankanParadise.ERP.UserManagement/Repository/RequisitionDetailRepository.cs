using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class RequisitionDetailRepository : IRequisitionDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public RequisitionDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddRequisitionDetail(RequisitionDetail requisitionDetail)
        {
            try
            {
                _dbContext.RequisitionDetails.Add(requisitionDetail);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
