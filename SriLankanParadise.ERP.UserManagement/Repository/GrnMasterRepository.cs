using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class GrnMasterRepository : IGrnMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public GrnMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddGrnMaster(GrnMaster grnMaster)
        {
            try
            {
                _dbContext.GrnMasters.Add(grnMaster);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<GrnMaster>> GetAll()
        {
            try
            {
                return await _dbContext.GrnMasters.Include(g => g.GrnDetails)
                    .Include(gm => gm.PurchaseOrder)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<GrnMaster>> GetGrnMastersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var grnMasters = await _dbContext.GrnMasters
                    .Where(gm => !gm.Status.ToString().EndsWith("0") && gm.CompanyId == companyId)
                    .Include(gm => gm.PurchaseOrder)
                    .Include(gm => gm.GrnDetails)
                    .ThenInclude(gd => gd.Item)
                    .ThenInclude(im => im.Unit)
                    .Include(gm => gm.WarehouseLocation)
                    .ToListAsync();

                return grnMasters.Any() ? grnMasters : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<GrnMaster>> GetGrnMastersByUserId(int userId)
        {
            try
            {
                var grnMasters = await _dbContext.GrnMasters
                    .Where(gm => gm.ReceivedUserId == userId)
                    .Include(gm => gm.PurchaseOrder)
                    .Include(gm => gm.GrnDetails)
                    .ThenInclude(gd => gd.Item)
                    .ThenInclude(im => im.Unit)
                    .Include(gm => gm.WarehouseLocation)
                    .ToListAsync();


                return grnMasters.Any() ? grnMasters : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<GrnMaster> GetGrnMasterByGrnMasterId(int grnMasterId)
        {
            try
            {
                var grnMaster = await _dbContext.GrnMasters
                    .Where(gm => gm.GrnMasterId == grnMasterId)
                    .Include(gm => gm.PurchaseOrder)
                    .Include(gm => gm.GrnDetails)
                    .ThenInclude(gd => gd.Item)
                    .ThenInclude(im => im.Unit)
                    .Include(gm => gm.WarehouseLocation)
                    .FirstOrDefaultAsync();

                return grnMaster;
            }
            catch (Exception)
            {
                throw;
            }
        }

         public async Task ApproveGrnMaster(int grnMasterId, GrnMaster grnMaster)
        {
            try
            {
                var existGrnMaster = await _dbContext.GrnMasters.FindAsync(grnMasterId);

                if (existGrnMaster != null)
                {
                    existGrnMaster.Status = grnMaster.Status;
                    existGrnMaster.ApprovedBy = grnMaster.ApprovedBy;
                    existGrnMaster.ApprovedUserId = grnMaster.ApprovedUserId;
                    existGrnMaster.ApprovedDate = grnMaster.ApprovedDate;

                    
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

         public async Task UpdateGrnMaster(int grnMasterId, GrnMaster grnMaster)
         {
             try
             {
                 var existGrnMaster = await _dbContext.GrnMasters.FindAsync(grnMasterId);

                 if (existGrnMaster != null)
                 {
                     _dbContext.Entry(existGrnMaster).CurrentValues.SetValues(grnMaster);
                     await _dbContext.SaveChangesAsync();
                 }
             }
             catch (Exception)
             {

                 throw;
             }
         }

         public async Task<IEnumerable<GrnMaster>> GetGrnMastersByPurchaseOrderId(int purchaseOrderId)
         {
             try
             {
                 var grnMasters = await _dbContext.GrnMasters
                     .Where(gm => gm.PurchaseOrderId == purchaseOrderId)
                     .Include(gm => gm.GrnDetails)
                     .ThenInclude(gd => gd.Item)
                     .ThenInclude(im => im.Unit)
                     .Include(gm => gm.WarehouseLocation)
                     .ToListAsync();

                 return grnMasters.Any() ? grnMasters : null;
             }
             catch (Exception)
             {
                 throw;
             }
         }

        public async Task<PagedResult<GrnMaster>> GetPaginatedGrnMastersByUserCompany(int CompanyId, string? filter = null, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                // Input validation
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var query = _dbContext.GrnMasters
                    .AsNoTracking()
                    .Include(gm => gm.PurchaseOrder)
                    .Include(gm => gm.GrnDetails)
                        .ThenInclude(gd => gd.Item)
                        .ThenInclude(im => im.Unit)
                    .Include(gm => gm.WarehouseLocation)
                    .Where(gm => gm.CompanyId == CompanyId);

                // Apply filter if provided
                if (!string.IsNullOrWhiteSpace(filter))
                {
                    query = query.Where(gm => EF.Functions.Like(gm.GrnType.ToLower(), filter.ToLower()));
                }

                var totalCount = await query.CountAsync();

                // Apply pagination and ordering
                var items = await query
                    .OrderByDescending(si => si.CreatedDate)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<GrnMaster>
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
