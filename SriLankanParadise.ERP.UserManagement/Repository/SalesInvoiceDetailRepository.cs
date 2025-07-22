using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SalesInvoiceDetailRepository : ISalesInvoiceDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SalesInvoiceDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddSalesInvoiceDetail(SalesInvoiceDetail salesInvoiceDetail)
        {
            try
            {
                _dbContext.SalesInvoiceDetails.Add(salesInvoiceDetail);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<SalesInvoiceDetail> GetSalesInvoiceDetailBySalesInvoiceDetailId(int salesInvoiceDetailId)
        {
            try
            {
                var salesInvoiceDetail = await _dbContext.SalesInvoiceDetails
                    .Where(si => si.SalesInvoiceDetailId == salesInvoiceDetailId)
                    .FirstOrDefaultAsync();

                return salesInvoiceDetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSalesInvoiceDetail(int salesInvoiceDetailId, SalesInvoiceDetail salesInvoiceDetail)
        {
            try
            {
                var existSalesInvoiceDetail = await _dbContext.SalesInvoiceDetails.FindAsync(salesInvoiceDetailId);

                if (existSalesInvoiceDetail != null)
                {
                    _dbContext.Entry(existSalesInvoiceDetail).CurrentValues.SetValues(salesInvoiceDetail);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSalesInvoiceDetail(int salesInvoiceDetailId)
        {
            try
            {
                var salesInvoiceDetail = await _dbContext.SalesInvoiceDetails.FindAsync(salesInvoiceDetailId);

                if (salesInvoiceDetail != null)
                {
                    _dbContext.SalesInvoiceDetails.Remove(salesInvoiceDetail);
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
