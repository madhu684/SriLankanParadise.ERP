using Microsoft.EntityFrameworkCore;
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

        public async Task<PurchaseRequisitionDetail> GetPurchaseRequisitionDetailByPurchaseRequisitionDetailId(int purchaseRequisitionDetailId)
        {
            try
            {
                var purchaseRequisitionDetail = await _dbContext.PurchaseRequisitionDetails
                    .Where(pr => pr.PurchaseRequisitionDetailId == purchaseRequisitionDetailId)
                    .FirstOrDefaultAsync();

                return purchaseRequisitionDetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdatePurchaseRequisitionDetail(int purchaseRequisitionDetailId, PurchaseRequisitionDetail purchaseRequisitionDetail)
        {
            try
            {
                var existPurchaseRequisitionDetail = await _dbContext.PurchaseRequisitionDetails.FindAsync(purchaseRequisitionDetailId);

                if (existPurchaseRequisitionDetail != null)
                {
                    _dbContext.Entry(existPurchaseRequisitionDetail).CurrentValues.SetValues(purchaseRequisitionDetail);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeletePurchaseRequisitionDetail(int purchaseRequisitionDetailId)
        {
            try
            {
                var purchaseRequisitionDetail = await _dbContext.PurchaseRequisitionDetails.FindAsync(purchaseRequisitionDetailId);

                if (purchaseRequisitionDetail != null)
                {
                    _dbContext.PurchaseRequisitionDetails.Remove(purchaseRequisitionDetail);
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
