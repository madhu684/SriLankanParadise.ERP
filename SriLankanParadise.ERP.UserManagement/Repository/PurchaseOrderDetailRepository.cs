using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PurchaseOrderDetailRepository : IPurchaseOrderDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PurchaseOrderDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddPurchaseOrderDetail(PurchaseOrderDetail purchaseOrderDetail)
        {
            try
            {
                _dbContext.PurchaseOrderDetails.Add(purchaseOrderDetail);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
