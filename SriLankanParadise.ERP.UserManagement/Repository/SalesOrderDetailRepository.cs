using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SalesOrderDetailRepository : ISalesOrderDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SalesOrderDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddSalesOrderDetail(SalesOrderDetail salesOrderDetail)
        {
            try
            {
                _dbContext.SalesOrderDetails.Add(salesOrderDetail);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<SalesOrderDetail> GetSalesOrderDetailBySalesOrderDetailId(int salesOrderDetailId)
        {
            try
            {
                var salesOrderDetail = await _dbContext.SalesOrderDetails
                    .Where(so => so.SalesOrderDetailId == salesOrderDetailId)
                    .FirstOrDefaultAsync();

                return salesOrderDetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSalesOrderDetail(int salesOrderDetailId, SalesOrderDetail salesOrderDetail)
        {
            try
            {
                var existSalesOrderDetail = await _dbContext.SalesOrderDetails.FindAsync(salesOrderDetailId);

                if (existSalesOrderDetail != null)
                {
                    _dbContext.Entry(existSalesOrderDetail).CurrentValues.SetValues(salesOrderDetail);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSalesOrderDetail(int salesOrderDetailId)
        {
            try
            {
                var salesOrderDetail = await _dbContext.SalesOrderDetails.FindAsync(salesOrderDetailId);

                if (salesOrderDetail != null)
                {
                    _dbContext.SalesOrderDetails.Remove(salesOrderDetail);
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
