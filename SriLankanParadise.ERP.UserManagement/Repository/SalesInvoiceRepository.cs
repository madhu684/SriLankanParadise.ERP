using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SalesInvoiceRepository : ISalesInvoiceRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SalesInvoiceRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddSalesInvoice(SalesInvoice salesInvoice)
        {
            try
            {
                _dbContext.SalesInvoices.Add(salesInvoice);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesInvoice>> GetAll()
        {
            try
            {
                return await _dbContext.SalesInvoices
                    .Include(si => si.SalesInvoiceDetails)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId, DateTime? date = null, string? searchQuery = null, string? filter = null, int? status = null)
        {
            try
            {
                var query = _dbContext.SalesInvoices
                    .AsNoTracking()
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(si => si.SalesOrder)
                    .ThenInclude(so => so.SalesOrderDetails)
                    .Where(si => si.Status !=0 && si.CompanyId == companyId);

                // Apply search filter
                if (!string.IsNullOrEmpty(searchQuery))
                {
                    var searchTerm = searchQuery.ToLower().Trim();
                    query = query.Where(im =>
                        im.ReferenceNo.ToLower().Contains(searchTerm)
                    );
                }

                // Apply Status filter
                if (status.HasValue)
                {
                    query = query.Where(im => im.Status == status.Value);
                }

                // Apply date and filter logic
                if (!string.IsNullOrEmpty(filter))
                {
                    switch (filter.ToLower())
                    {
                        case "outstanding":
                            // Only outstanding invoices (regardless of date)
                            query = query.Where(im => im.AmountDue > 100);
                            break;

                        case "all":
                            // Today's invoices + all outstanding invoices
                            if (date.HasValue)
                            {
                                var targetDate = date.Value.Date;
                                query = query.Where(im =>
                                    (im.InvoiceDate.HasValue && im.InvoiceDate.Value.Date == targetDate) ||
                                    im.AmountDue > 100
                                );
                            }
                            break;

                        default:
                            // If date is provided but no specific filter, use date only
                            if (date.HasValue)
                            {
                                var targetDate = date.Value.Date;
                                query = query.Where(im => im.InvoiceDate.HasValue && im.InvoiceDate.Value.Date == targetDate);
                            }
                            break;
                    }
                }
                else
                {
                    // No filter specified, apply date filter only if date is provided
                    if (date.HasValue)
                    {
                        var targetDate = date.Value.Date;
                        query = query.Where(im => im.InvoiceDate.HasValue && im.InvoiceDate.Value.Date == targetDate);
                    }
                }

                var salesInvoices = await query.ToListAsync();

                return salesInvoices.Any() ? salesInvoices : new List<SalesInvoice>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByUserId(int userId)
        {
            try
            {
                var salesInvoices = await _dbContext.SalesInvoices
                    .Where(si => si.CreatedUserId == userId)
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.ItemMaster)
                            .ThenInclude(im => im.Unit)
                    .Include(si => si.SalesOrder)
                    .ToListAsync();

                return salesInvoices.Any() ? salesInvoices : Enumerable.Empty<SalesInvoice>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task ApproveSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice)
        {
            try
            {
                var existsSalesInvoice = await _dbContext.SalesInvoices.FindAsync(salesInvoiceId);

                if (existsSalesInvoice != null)
                {
                    existsSalesInvoice.Status = salesInvoice.Status;
                    existsSalesInvoice.ApprovedBy = salesInvoice.ApprovedBy;
                    existsSalesInvoice.ApprovedUserId = salesInvoice.ApprovedUserId;
                    existsSalesInvoice.ApprovedDate = salesInvoice.ApprovedDate;

                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<SalesInvoice> GetSalesInvoiceBySalesInvoiceId(int salesInvoiceId)
        {
            try
            {
                var salesInvoice = await _dbContext.SalesInvoices
                    .Where(si => si.SalesInvoiceId == salesInvoiceId)
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(si => si.SalesOrder)
                    .FirstOrDefaultAsync();

                return salesInvoice;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice)
        {
            try
            {
                var existsSalesInvoice = await _dbContext.SalesInvoices.FindAsync(salesInvoiceId);

                if (existsSalesInvoice != null)
                {
                    _dbContext.Entry(existsSalesInvoice).CurrentValues.SetValues(salesInvoice);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSalesInvoice(int salesInvoiceId)
        {
            try
            {
                var salesInvoice = await _dbContext.SalesInvoices.FirstOrDefaultAsync(po => po.SalesInvoiceId == salesInvoiceId);
                if (salesInvoice == null)
                {
                    throw new KeyNotFoundException($"Sales Invoice with ID {salesInvoiceId} not found");
                }

                var strategy = _dbContext.Database.CreateExecutionStrategy();

                await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _dbContext.Database.BeginTransactionAsync();

                    try
                    {
                        var salesInvoiceDetails = await _dbContext.SalesInvoiceDetails
                            .Where(si => si.SalesInvoiceId == salesInvoiceId)
                            .ToListAsync();

                        if (salesInvoiceDetails.Any())
                        {
                            _dbContext.SalesInvoiceDetails.RemoveRange(salesInvoiceDetails);
                        }

                        _dbContext.SalesInvoices.Remove(salesInvoice);

                        await _dbContext.SaveChangesAsync();

                        await transaction.CommitAsync();
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        throw new Exception($"Error deleting sales invoice with ID {salesInvoiceId}", ex);
                    }
                });
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<SalesInvoice> GetSalesInvoiceById(int salesInvoiceId)
        {
            try
            {
                var salesInvoice = await _dbContext.SalesInvoices
                    .Include(si => si.SalesInvoiceDetails)
                    .FirstOrDefaultAsync(si => si.SalesInvoiceId == salesInvoiceId);
                return salesInvoice;
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<PagedResult<SalesInvoice>> GetSalesInvoicesByCustomerSearch(string? name = null, string? phone = null, DateTime? fromDate = null, DateTime? toDate = null, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                // Input validation
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var query = _dbContext.SalesInvoices
                    .AsNoTracking()
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.ItemMaster)
                            .ThenInclude(im => im.Unit)
                    .Include(si => si.SalesOrder)
                        .ThenInclude(so => so.Customer)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(name))
                {
                    query = query.Where(si => si.InVoicedPersonName.Contains(name));
                }

                if (!string.IsNullOrEmpty(phone))
                {
                    query = query.Where(si => si.InVoicedPersonMobileNo.Contains(phone));
                }

                if (fromDate.HasValue)
                {
                    var startDate = fromDate.Value.Date;
                    query = query.Where(si => si.InvoiceDate >= startDate);
                }

                if (toDate.HasValue)
                {
                    var endDate = toDate.Value.Date.AddDays(1).AddTicks(-1);
                    query = query.Where(si => si.InvoiceDate <= endDate);
                }

                var totalCount = await query.CountAsync();

                var items = await query
                    .OrderBy(si => si.InvoiceDate)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<SalesInvoice>
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

        public async Task<PagedResult<SalesInvoice>> GetPaginatedFilteredSalesInvoiceByCompanyIdDate(int companyId, DateTime? date, string? searchQuery = null, string? filter = null, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                // Input validation
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var query = _dbContext.SalesInvoices
                    .AsNoTracking()
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(si => si.SalesOrder)
                    .ThenInclude(so => so.SalesOrderDetails)
                    .Where(si => si.Status != 0 && si.CompanyId == companyId);

                // Apply search filter
                if (!string.IsNullOrEmpty(searchQuery))
                {
                    var searchTerm = searchQuery.ToLower().Trim();
                    query = query.Where(im =>
                        im.ReferenceNo.ToLower().Contains(searchTerm)
                    );
                }

                // MODIFIED SECTION - Apply date and filter logic
                if (!string.IsNullOrEmpty(filter))
                {
                    switch (filter.ToLower())
                    {
                        case "outstanding":
                            // Only outstanding invoices (regardless of date)
                            query = query.Where(im => im.AmountDue > 100);
                            break;

                        case "all":
                            // Today's invoices + all outstanding invoices
                            if (date.HasValue)
                            {
                                var targetDate = date.Value.Date;
                                query = query.Where(im =>
                                    (im.InvoiceDate.HasValue && im.InvoiceDate.Value.Date == targetDate) ||
                                    im.AmountDue > 100
                                );
                            }
                            break;

                        default:
                            // If date is provided but no specific filter, use date only
                            if (date.HasValue)
                            {
                                var targetDate = date.Value.Date;
                                query = query.Where(im => im.InvoiceDate.HasValue && im.InvoiceDate.Value.Date == targetDate);
                            }
                            break;
                    }
                }
                else
                {
                    // No filter specified, apply date filter only if date is provided
                    if (date.HasValue)
                    {
                        var targetDate = date.Value.Date;
                        query = query.Where(im => im.InvoiceDate.HasValue && im.InvoiceDate.Value.Date == targetDate);
                    }
                }

                var totalCount = await query.CountAsync();

                // Apply pagination and ordering
                var items = await query
                    .OrderByDescending(si => si.InvoiceDate) // Added ordering for better UX
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<SalesInvoice>
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
    }
}
