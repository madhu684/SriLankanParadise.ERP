using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SalesReceiptSalesInvoiceRepository : ISalesReceiptSalesInvoiceRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SalesReceiptSalesInvoiceRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddSalesReceiptSalesInvoice(SalesReceiptSalesInvoice salesReceiptSalesInvoice)
        {
            try
            {
                _dbContext.SalesReceiptSalesInvoices.Add(salesReceiptSalesInvoice);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<SalesReceiptSalesInvoice> GetSalesReceiptSalesInvoiceBySalesReceiptSalesInvoiceId(int salesReceiptSalesInvoiceId)
        {
            try
            {
                var salesReceiptSalesInvoice = await _dbContext.SalesReceiptSalesInvoices
                    .Where(srsi => srsi.SalesReceiptSalesInvoiceId == salesReceiptSalesInvoiceId)
                    .FirstOrDefaultAsync();

                return salesReceiptSalesInvoice;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId, SalesReceiptSalesInvoice salesReceiptSalesInvoice)
        {
            try
            {
                var existSalesReceiptSalesInvoice = await _dbContext.SalesReceiptSalesInvoices.FindAsync(salesReceiptSalesInvoiceId);

                if (existSalesReceiptSalesInvoice != null)
                {
                    _dbContext.Entry(existSalesReceiptSalesInvoice).CurrentValues.SetValues(salesReceiptSalesInvoice);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId)
        {
            try
            {
                var salesReceiptSalesInvoice = await _dbContext.SalesReceiptSalesInvoices.FindAsync(salesReceiptSalesInvoiceId);

                if (salesReceiptSalesInvoice != null)
                {
                    _dbContext.SalesReceiptSalesInvoices.Remove(salesReceiptSalesInvoice);
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
