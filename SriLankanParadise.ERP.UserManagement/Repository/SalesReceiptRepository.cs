using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;
using System.ComponentModel.Design;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SalesReceiptRepository : ISalesReceiptRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SalesReceiptRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddSalesReceipt(SalesReceipt salesReceipt)
        {
            try
            {
                _dbContext.SalesReceipts.Add(salesReceipt);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesReceipt>> GetAll()
        {
            try
            {
                return await _dbContext.SalesReceipts
                    .Include(sr => sr.PaymentMode)
                    .Include(sr => sr.SalesReceiptSalesInvoices)
                    .ThenInclude(srsi => srsi.SalesInvoice)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var salesReceipts = await _dbContext.SalesReceipts
                    .Where(sr => sr.Status != 0 && sr.CompanyId == companyId)
                    .Include(sr => sr.PaymentMode)
                    .Include(sr => sr.SalesReceiptSalesInvoices)
                        .ThenInclude(srsi => srsi.SalesInvoice)
                            .ThenInclude(si => si.SalesInvoiceDetails)
                                .ThenInclude(sid => sid.ItemMaster)
                    .ToListAsync();

                return salesReceipts.Any() ? salesReceipts : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserId(int userId)
        {
            try
            {
                var salesReceipts = await _dbContext.SalesReceipts
                    .Where(sr => sr.CreatedUserId == userId)
                    .Include(sr => sr.PaymentMode)
                    .Include(sr => sr.SalesReceiptSalesInvoices)
                        .ThenInclude(srsi => srsi.SalesInvoice)
                            .ThenInclude(si => si.SalesInvoiceDetails)
                                .ThenInclude(sid => sid.ItemMaster)
                    .ToListAsync();


                return salesReceipts.Any() ? salesReceipts : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<SalesReceipt> GetSalesReceiptBySalesReceiptId(int salesReceiptId)
        {
            try
            {
                var salesReceipt = await _dbContext.SalesReceipts
                    .Where(sr => sr.SalesReceiptId == salesReceiptId)
                    .Include(sr => sr.PaymentMode)
                    .FirstOrDefaultAsync();

                if (salesReceipt != null)
                {
                    // Manually load all related invoices including write-offed ones
                    // This ensures we get all invoices regardless of their status
                    salesReceipt.SalesReceiptSalesInvoices = await _dbContext.SalesReceiptSalesInvoices
                        .Where(srsi => srsi.SalesReceiptId == salesReceiptId)
                        .Include(srsi => srsi.SalesInvoice) // This will include all invoices even with status 8
                        .ToListAsync();
                }

                return salesReceipt;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSalesReceipt(int salesReceiptId, SalesReceipt salesReceipt)
        {
            try
            {
                var existsSalesReceipt = await _dbContext.SalesReceipts.FindAsync(salesReceiptId);

                if (existsSalesReceipt != null)
                {
                    _dbContext.Entry(existsSalesReceipt).CurrentValues.SetValues(salesReceipt);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserIdAndDate(int userId, DateTime? date, int? cashierSessionId = null)
        {
            try
            {
                var query = _dbContext.SalesReceipts
                    .AsNoTracking()
                    .Include(sr => sr.PaymentMode)
                    .Include(sr => sr.SalesReceiptSalesInvoices)
                        .ThenInclude(srsi => srsi.SalesInvoice)
                            .ThenInclude(si => si.SalesInvoiceDetails)
                                .ThenInclude(sid => sid.ItemMaster)
                    .Where(sr => sr.CreatedUserId == userId);

                if (date.HasValue)
                {
                    var targetDate = date.Value.Date;
                    query = query.Where(im => im.ReceiptDate.HasValue && im.ReceiptDate.Value.Date == targetDate);
                }

                if (cashierSessionId.HasValue)
                {
                    query = query.Where(sr => sr.CashierSessionId == cashierSessionId.Value);
                }

                var receipts = await query
                    .OrderBy(sr => sr.SalesReceiptId)
                    .ToListAsync();

                return receipts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByDate(DateTime date)
        {
            try
            {
                var query = _dbContext.SalesReceipts
                    .AsNoTracking()
                    .Include(sr => sr.PaymentMode)
                    .Include(sr => sr.SalesReceiptSalesInvoices)
                        .ThenInclude(srsi => srsi.SalesInvoice)
                            .ThenInclude(si => si.SalesInvoiceDetails)
                                .ThenInclude(sid => sid.ItemMaster)
                    .Where(sr => sr.ReceiptDate.HasValue && sr.ReceiptDate.Value.Date == date.Date);

                var receipts = await query
                    .OrderBy(sr => sr.CreatedUserId)
                    .ThenBy(sr => sr.CashierSessionId)
                    .ThenBy(sr => sr.SalesReceiptId)
                    .ToListAsync();

                return receipts;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
