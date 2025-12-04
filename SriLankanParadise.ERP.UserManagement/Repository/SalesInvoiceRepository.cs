using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
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

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoiceByDateRange(DateTime fromDate, DateTime toDate)
        {
            try
            {
                var salesInvoices = await _dbContext.SalesInvoices
                     .Where(x => EF.Functions.DateDiffDay(fromDate, x.InvoiceDate) >= 0
                                    && EF.Functions.DateDiffDay(toDate, x.InvoiceDate) <= 0)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.SalesPerson)
                    .Include(si => si.Customer)
                        .ThenInclude(c => c.Region)
                    .Include(si => si.CustomerDeliveryAddress)
                    .Include(si => si.SalesInvoiceDetails)
                        .ThenInclude(ib => ib.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .OrderBy(si => si.ApprovedDate)
                    .ToListAsync();

                return salesInvoices.Any() ? salesInvoices : null!;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
