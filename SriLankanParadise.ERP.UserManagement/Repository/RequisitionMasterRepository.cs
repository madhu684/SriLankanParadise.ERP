using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class RequisitionMasterRepository : IRequisitionMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public RequisitionMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddRequisitionMaster(RequisitionMaster requisitionMaster)
        {
            try
            {
                _dbContext.RequisitionMasters.Add(requisitionMaster);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<RequisitionMaster>> GetAll()
        {
            try
            {
                return await _dbContext.RequisitionMasters
                    .Include(rm => rm.RequisitionDetails)
                    .ThenInclude(rd => rd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(rm => rm.RequestedFromLocation)
                    .Include(rm => rm.RequestedToLocation)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var requisitionMasters = await _dbContext.RequisitionMasters
                    .Where(rm => rm.Status != 0 && rm.CompanyId == companyId)
                    .Include(rm => rm.RequisitionDetails)
                    .ThenInclude(rd => rd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(rm => rm.RequestedFromLocation)
                    .Include(rm => rm.RequestedToLocation)
                    .ToListAsync();

                if (requisitionMasters.Any())
                {
                    return requisitionMasters;
                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task ApproveRequisitionMaster(int requisitionMasterId, RequisitionMaster requisitionMaster)
        {
            try
            {
                var existRequisitionMaster = await _dbContext.RequisitionMasters.FindAsync(requisitionMasterId);

                if (existRequisitionMaster != null)
                {
                    existRequisitionMaster.Status = requisitionMaster.Status;
                    existRequisitionMaster.ApprovedBy = requisitionMaster.ApprovedBy;
                    existRequisitionMaster.ApprovedUserId = requisitionMaster.ApprovedUserId;
                    existRequisitionMaster.ApprovedDate = requisitionMaster.ApprovedDate;

                    /*_dbContext.Entry(existRequisitionMaster).CurrentValues.SetValues(requisitionMaster);*/
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<RequisitionMaster> GetRequisitionMasterByRequisitionMasterId(int requisitionMasterId)
        {
            try
            {
                var requisitionMaster = await _dbContext.RequisitionMasters
                    .Where(rm => rm.RequisitionMasterId == requisitionMasterId)
                    .Include(rm => rm.RequisitionDetails)
                    .ThenInclude( rd => rd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(rm => rm.RequestedFromLocation)
                    .Include(rm => rm.RequestedToLocation)
                    .FirstOrDefaultAsync();

                return requisitionMaster;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersByUserId(int userId)
        {
            try
            {
                var requisitionMasters = await _dbContext.RequisitionMasters
                    .Where(rm => rm.RequestedUserId == userId)
                    .Include(rm => rm.RequisitionDetails)
                    .ThenInclude(rd => rd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(rm => rm.RequestedFromLocation)
                    .Include(rm => rm.RequestedToLocation)
                    .ToListAsync();

                if (requisitionMasters.Any())
                {
                    return requisitionMasters;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task PatchMinApproved(int requisitionMasterId, RequisitionMaster requisitionMaster)
        {
            try
            {
                var existRequisitionMaster = await _dbContext.RequisitionMasters.FindAsync(requisitionMasterId);

                if (existRequisitionMaster != null)
                {
                    existRequisitionMaster.IsMINApproved = requisitionMaster.IsMINApproved;
                    existRequisitionMaster.IsMINAccepted = requisitionMaster.IsMINAccepted;
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteRrequisitionMasterAndDetailById(int requisitionMasterId)
        {
            var executionStrategy = _dbContext.Database.CreateExecutionStrategy();
            await executionStrategy.ExecuteAsync(async () =>
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync();
                try
                {
                    // Delete all associated RequisitionDetails
                    var requisitionDetails = await _dbContext.RequisitionDetails
                        .Where(rd => rd.RequisitionMasterId == requisitionMasterId)
                        .ToListAsync();

                    if (requisitionDetails.Any())
                    {
                        _dbContext.RequisitionDetails.RemoveRange(requisitionDetails);
                        await _dbContext.SaveChangesAsync();
                    }

                    // Delete the RequisitionMaster
                    var requisitionMaster = await _dbContext.RequisitionMasters
                        .FirstOrDefaultAsync(rm => rm.RequisitionMasterId == requisitionMasterId);

                    if(requisitionMaster != null)
                    {
                        _dbContext.RequisitionMasters.Remove(requisitionMaster);
                        await _dbContext.SaveChangesAsync();
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }
    }
}