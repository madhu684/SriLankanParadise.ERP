using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
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

        public async Task<PagedResult<SalesReceipt>> GetSalesReceiptsWithoutDraftsByCompanyId(int companyId, DateTime? date = null, int? createdUserId = null, string? filter = null, string? searchQuery = null, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                // Input validation
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var query = _dbContext.SalesReceipts
                    .AsNoTracking()
                    .Where(sr => sr.Status != 0 && sr.CompanyId == companyId)
                    .Include(sr => sr.PaymentMode)
                    .Include(sr => sr.SalesReceiptSalesInvoices)
                        .ThenInclude(srsi => srsi.SalesInvoice)
                            .ThenInclude(si => si.SalesInvoiceDetails)
                                .ThenInclude(sid => sid.ItemMaster)
                    .AsQueryable();

                if (date.HasValue)
                {
                    query = query.Where(sr => sr.ReceiptDate.HasValue && sr.ReceiptDate.Value.Date == date.Value.Date);
                }

                if (createdUserId.HasValue)
                {
                    query = query.Where(sr => sr.CreatedUserId == createdUserId.Value);
                }

                if (!string.IsNullOrEmpty(filter))
                {
                    switch(filter.ToLower())
                    {
                        case "outstanding":
                            query = query.Where(sr => sr.OutstandingAmount > 0);
                            break;
                        case "excess":
                            query = query.Where(sr => sr.ExcessAmount > 0);
                            break;
                        default:
                            // No filter applied
                            break;
                    }
                }

                if (!string.IsNullOrEmpty(searchQuery))
                {
                    var searchTerm = searchQuery.ToLower().Trim();
                    query = query.Where(sr =>
                        sr.ReferenceNumber.ToLower().Contains(searchTerm)
                    );
                }

                var totalCount = await query.CountAsync();

                var items = await query
                    .OrderByDescending(sr => sr.SalesReceiptId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<SalesReceipt>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };
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

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsBySessionId(int sessionId)
        {
            try
            {
                var salesReceipts = await _dbContext.SalesReceipts
                    .Where(sr => sr.CashierSessionId == sessionId)
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

        public async Task ReverseSalesReceipt(int salesReceiptId)
        {
            var strategy = _dbContext.Database.CreateExecutionStrategy();

            await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
                    var salesReceipt = await _dbContext.SalesReceipts
                        .Include(sr => sr.SalesReceiptSalesInvoices)
                        .FirstOrDefaultAsync(sr => sr.SalesReceiptId == salesReceiptId);

                    if (salesReceipt == null)
                    {
                        throw new KeyNotFoundException($"Sales receipt with ID {salesReceiptId} not found.");
                    }

                    // Process each associated invoice link
                    foreach (var link in salesReceipt.SalesReceiptSalesInvoices.ToList())
                    {
                        var salesInvoice = await _dbContext.SalesInvoices
                            .FirstOrDefaultAsync(si => si.SalesInvoiceId == link.SalesInvoiceId);

                        if (salesInvoice != null)
                        {
                            // If it was fully settled (Status 5), move it back to Approved (Status 2)
                            // or keep it at Status 2 if it was partially settled.
                            if (salesInvoice.Status == 5)
                            {
                                salesInvoice.Status = 2; // Set back to Approve
                            }

                            // Add the collected amount back to the invoice's due amount
                            salesInvoice.AmountDue = (salesInvoice.AmountDue ?? 0) + (link.SettledAmount ?? 0);
                            
                            _dbContext.SalesInvoices.Update(salesInvoice);
                        }

                        // Remove the link between receipt and invoice
                        _dbContext.SalesReceiptSalesInvoices.Remove(link);
                    }

                    // Finally, delete the SalesReceipt
                    _dbContext.SalesReceipts.Remove(salesReceipt);

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception($"Failed to reverse sales receipt with ID {salesReceiptId}.", ex);
                }
            });
        }
    }

}