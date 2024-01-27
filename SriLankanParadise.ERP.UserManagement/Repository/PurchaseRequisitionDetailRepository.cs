using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PurchaseRequisitionDetailRepository : IPurchaseRequisitionDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PurchaseRequisitionDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddPurchaseRequisitionDetail(PurchaseRequisitionDetail purchaseRequisitionDetail)
        {
            try
            {
                _dbContext.PurchaseRequisitionDetails.Add(purchaseRequisitionDetail);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
