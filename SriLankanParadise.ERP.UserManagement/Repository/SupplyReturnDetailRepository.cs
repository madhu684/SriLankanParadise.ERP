using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SupplyReturnDetailRepository : ISupplyReturnDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SupplyReturnDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddSupplyReturnDetail(SupplyReturnDetail supplyReturnDetail)
        {
            try
            {
                _dbContext.SupplyReturnDetails.Add(supplyReturnDetail);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteSupplyReturnDetail(int supplyReturnDetailId)
        {
            try
            {
                var supplyReturnDetail = await _dbContext.SupplyReturnDetails.FindAsync(supplyReturnDetailId);

                if (supplyReturnDetail != null)
                {
                    _dbContext.SupplyReturnDetails.Remove(supplyReturnDetail);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<SupplyReturnDetail> GetSupplyReturnDetailByReturnId(int supplyReturnDetailId)
        {
            try
            {
                var supplyReturnDetail = await _dbContext.SupplyReturnDetails
                    .Where(x => x.SupplyReturnDetailId == supplyReturnDetailId)
                    .FirstOrDefaultAsync();

                return supplyReturnDetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSupplyReturnDetail(int supplyReturnDetailId, SupplyReturnDetail supplyReturnDetail)
        {
            try
            {
                var existSupplyReturnDetail = await _dbContext.SupplyReturnDetails.FindAsync(supplyReturnDetailId);

                if (existSupplyReturnDetail != null)
                {
                    _dbContext.Entry(existSupplyReturnDetail).CurrentValues.SetValues(supplyReturnDetail);
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
