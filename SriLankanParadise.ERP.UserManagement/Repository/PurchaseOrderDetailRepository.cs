using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
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

        public async Task<PurchaseOrderDetail> GetPurchaseOrderDetailByPurchaseOrderDetailId(int purchaseOrderDetailId)
        {
            try
            {
                var purchaseOrderDetail = await _dbContext.PurchaseOrderDetails
                    .Where(po => po.PurchaseOrderDetailId == purchaseOrderDetailId)
                    .FirstOrDefaultAsync();

                return purchaseOrderDetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdatePurchaseOrderDetail(int purchaseOrderDetailId, PurchaseOrderDetail purchaseOrderDetail)
        {
            try
            {
                var existPurchaseOrderDetail = await _dbContext.PurchaseOrderDetails.FindAsync(purchaseOrderDetailId);

                if (existPurchaseOrderDetail != null)
                {
                    _dbContext.Entry(existPurchaseOrderDetail).CurrentValues.SetValues(purchaseOrderDetail);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeletePurchaseOrderDetail(int purchaseOrderDetailId)
        {
            try
            {
                var purchaseOrderDetail = await _dbContext.PurchaseOrderDetails.FindAsync(purchaseOrderDetailId);

                if (purchaseOrderDetail != null)
                {
                    _dbContext.PurchaseOrderDetails.Remove(purchaseOrderDetail);
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
