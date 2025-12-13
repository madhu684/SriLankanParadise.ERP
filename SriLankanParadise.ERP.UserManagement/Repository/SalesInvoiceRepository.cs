using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;
using System.Linq;

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
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
                    .Include(si => si.SalesInvoiceDetails)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var salesInvoices = await _dbContext.SalesInvoices
                    .Where(si => si.Status != 0 && si.CompanyId == companyId)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(si => si.SalesOrder)
                        .ThenInclude(so => so.SalesOrderDetails)
                    //.OrderByDescending(si => si.CreatedDate)
                    .ToListAsync();

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
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
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
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
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
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
                    .Include(si => si.SalesInvoiceDetails)
                    .FirstOrDefaultAsync(si => si.SalesInvoiceId == salesInvoiceId);
                return salesInvoice;
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByCustomerIdStatus(int customerId, int status)
        {
            try
            {
                var salesInvoice = await _dbContext.SalesInvoices
                    .Where(si => si.CustomerId == customerId && si.Status == status)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
                    .Include(si => si.SalesInvoiceDetails)
                    .OrderBy(si => si.ApprovedDate)
                    .ToListAsync();

                return salesInvoice;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoiceByReference(string reference, int status)
        {
            try
            {
                // Check if reference is provided
                if (string.IsNullOrEmpty(reference))
                {
                    return null;
                }

                var query = _dbContext.SalesInvoices.Where(si => si.ReferenceNo.Contains(reference) && si.Status == status);

                query = query
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .OrderBy(si => si.ApprovedDate);


                var salesInvoices = await query.ToListAsync();

                return salesInvoices.Any() ? salesInvoices : null!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PagedResult<SalesInvoice>> GetSalesInvoiceByDateRange(
            DateTime fromDate,
            DateTime toDate,
            int? customerId = null,
            int? regionId = null,
            int? salesPersonId = null,
            int pageNumber = 1, 
            int pageSize = 10)
        {
            try
            {

                // Input validation
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var fromDateStart = fromDate.Date;
                var toDateEnd = toDate.Date.AddDays(1).AddTicks(-1);

                var query = _dbContext.SalesInvoices
                    .AsNoTracking()
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Where(si => si.InvoiceDate >= fromDateStart && si.InvoiceDate <= toDateEnd);

                // Apply optional filters
                if (customerId.HasValue)
                {
                    query = query.Where(si => si.CustomerId == customerId.Value);
                }

                if (regionId.HasValue)
                {
                    query = query.Where(si => si.Customer.RegionId == regionId.Value);
                }

                if (salesPersonId.HasValue)
                {
                    query = query.Where(si => si.Customer.SalesPersonId == salesPersonId.Value);
                }

                var salesInvoices = await query
                    .OrderBy(si => si.InvoiceDate)
                    .ToListAsync();

                // Get total count (for pagination metadata)
                var totalCount = await query.CountAsync();

                // Apply pagination
                var items = await query
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

        public async Task<AgeAnalysisWithTotalsDto> GetAgeAnalysisWithTotals(AgeAnalysisRequest request)
        {
            try
            {
                // Input validation
                if (request.PageNumber < 1) request.PageNumber = 1;
                if (request.PageSize < 1) request.PageSize = 10;
                if (request.PageSize > 100) request.PageSize = 100;

                // Validate slabs
                if (request.Slabs == null || request.Slabs.Count == 0 || request.Slabs.Count > 5)
                {
                    throw new ArgumentException("Slabs must be provided and cannot exceed 5 slabs.");
                }

                var sortedSlabs = request.Slabs.OrderBy(s => s.FromDays).ToList();

                // Query sales invoices with amount due > 0 (unpaid or partially paid)
                var query = _dbContext.SalesInvoices
                    .AsNoTracking()
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                        .Where(si => si.AmountDue > 0);
                //.Where(si => si.Status != 0 && si.AmountDue.HasValue && si.AmountDue.Value > 0);

                // Apply optional filters
                if (request.CustomerIds != null && request.CustomerIds.Any())
                {
                    var customerIds = request.CustomerIds.Where(id => id > 0).ToList();
                    if (customerIds.Any())
                        query = query.Where(si => customerIds.Contains(si.CustomerId.Value));
                }

                if (request.RegionIds != null && request.RegionIds.Any())
                {
                    var regionIds = request.RegionIds.Where(id => id > 0).ToList();
                    if (regionIds.Any())
                        query = query.Where(si => regionIds.Contains(si.Customer.RegionId.Value));
                }

                if (request.SalesPersonIds != null && request.SalesPersonIds.Any())
                {
                    var salesPersonIds = request.SalesPersonIds.Where(id => id > 0).ToList();
                    if (salesPersonIds.Any())
                        query = query.Where(si => salesPersonIds.Contains(si.Customer.SalesPersonId.Value));
                }

                // Get all invoices (we'll process aging in memory)
                var allInvoices = await query.ToListAsync();

                if (!allInvoices.Any())
                {
                    // Return empty result if no invoices found
                    return new AgeAnalysisWithTotalsDto
                    {
                        Items = new List<AgeAnalysisInvoiceItem>(),
                        TotalCount = 0,
                        PageNumber = request.PageNumber,
                        PageSize = request.PageSize,
                        TotalPages = 0,
                        SlabTotals = sortedSlabs.ToDictionary(s => s.Label, s => 0m),
                        TotalAmountDue = 0m
                    };
                }

                // Calculate aging and assign to slabs for ALL invoices
                var processedInvoices = allInvoices
                    .Select(si =>
                    {
                        // Safely calculate aging days – if InvoiceDate is null, treat as 0 aging (or very high – your choice)
                        var invoiceDate = si.InvoiceDate?.Date ?? request.AsOfDate.Date; // fallback to AsOfDate → 0 days
                        var agingDays = (request.AsOfDate.Date - invoiceDate).Days;

                        var assignedSlab = DetermineSlabForInvoice(agingDays, sortedSlabs);

                        var slabAmounts = sortedSlabs.ToDictionary(
                            s => s.Label,
                            s => s.Label == assignedSlab.Label ? si.AmountDue.Value : 0m);

                        return new AgeAnalysisInvoiceItem
                        {
                            SalesInvoiceId = si.SalesInvoiceId,
                            ReferenceNo = si.ReferenceNo ?? "",
                            CustomerName = si.Customer?.CustomerName ?? "",
                            CustomerCode = si.Customer?.CustomerCode ?? "",
                            SalesPersonName = (si.Customer?.SalesPerson?.FirstName + " " + si.Customer?.SalesPerson?.LastName)?.Trim() ?? "",
                            SalesPersonCode = si.Customer?.SalesPerson?.SalesPersonCode ?? "",
                            RegionName = si.Customer?.Region?.Name ?? "",
                            RegionCode = si.Customer?.Region?.Alias ?? "",
                            InvoiceDate = si.InvoiceDate,
                            TotalAmount = si.TotalAmount,
                            AmountDue = si.AmountDue,
                            AgingDays = agingDays,
                            SlabLabel = assignedSlab.Label,
                            SlabAmounts = slabAmounts
                        };
                    })
                    .OrderByDescending(i => i.AgingDays)
                    .ToList();

                // Calculate totals from ALL processed invoices
                var slabTotals = new Dictionary<string, decimal>();
                foreach (var slab in sortedSlabs)
                {
                    slabTotals[slab.Label] = processedInvoices.Sum(i => i.SlabAmounts[slab.Label]);
                }
                var totalAmountDue = processedInvoices.Sum(i => i.AmountDue ?? 0);

                // Get total count
                var totalCount = processedInvoices.Count;

                // Apply pagination to get current page items
                var pagedItems = processedInvoices
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                return new AgeAnalysisWithTotalsDto
                {
                    Items = pagedItems,
                    TotalCount = totalCount,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize),
                    SlabTotals = slabTotals,
                    TotalAmountDue = totalAmountDue
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        private SlabDefinition DetermineSlabForInvoice(int agingDays, List<SlabDefinition> slabs)
        {
            // Iterate through slabs to find the matching one
            foreach (var slab in slabs)
            {
                // If ToDays is null, this is the "over" slab (catches everything >= FromDays)
                if (!slab.ToDays.HasValue)
                {
                    if (agingDays >= slab.FromDays)
                    {
                        return slab;
                    }
                }
                // Check if aging days falls within the range [FromDays, ToDays]
                else if (agingDays >= slab.FromDays && agingDays <= slab.ToDays.Value)
                {
                    return slab;
                }
            }

            // If no slab found, return the last slab (fallback)
            return slabs.Last();
        }
    }
}
