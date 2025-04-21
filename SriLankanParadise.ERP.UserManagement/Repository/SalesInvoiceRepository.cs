using Microsoft.EntityFrameworkCore;
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
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(sid => sid.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(sod => sod.ItemBatch)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(si => si.SalesOrder)
                    .ThenInclude(so => so.SalesOrderDetails)
                    .ToListAsync();

                return salesInvoices.Any() ? salesInvoices : null;
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
                    .ThenInclude(sid => sid.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(sod => sod.ItemBatch)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(si => si.SalesOrder)
                    .ToListAsync();

                return salesInvoices.Any() ? salesInvoices : null;
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
                    .ThenInclude(sid => sid.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .Include(si => si.SalesInvoiceDetails)
                    .ThenInclude(sod => sod.ItemBatch)
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
    }
}
