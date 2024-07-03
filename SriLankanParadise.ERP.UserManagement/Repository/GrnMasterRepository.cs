using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
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
    }
}
