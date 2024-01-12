using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PurchaseOrderRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddPurchaseOrder(PurchaseOrder purchaseOrder)
        {
            try
            {
                _dbContext.PurchaseOrders.Add(purchaseOrder);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAll()
        {
            try
            {
                return await _dbContext.PurchaseOrders.Include(po => po.PurchaseOrderDetails).ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
