using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class IssueMasterRepository : IIssueMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public IssueMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddIssueMaster(IssueMaster issueMaster)
        {
            try
            {
                _dbContext.IssueMasters.Add(issueMaster);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<IssueMaster>> GetAll()
        {
            try
            {
                return await _dbContext.IssueMasters
                    .Include(im=>im.RequisitionMaster)
                    .Include(rm => rm.IssueDetails)
                    .ThenInclude(id => id.ItemMaster )
                    .ThenInclude(im => im.Unit)
                    .Include(rm => rm.IssueDetails)
                    .ThenInclude(id => id.Batch)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<IssueMaster>> GetIssueMastersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var issueMasters = await _dbContext.IssueMasters
                    .Where(rm => rm.Status != 0 && rm.CompanyId == companyId)
                    .Include(im => im.RequisitionMaster)
                    .Include(rm => rm.IssueDetails)
                    .ThenInclude(rd => rd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(rm => rm.IssueDetails)
                    .ThenInclude(id => id.Batch)
                    .ToListAsync();

                if (issueMasters.Any())
                {
                    return issueMasters;
                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task ApproveIssueMaster(int issueMasterId, IssueMaster issueMaster)
        {
            try
            {
                var existIssueMaster = await _dbContext.IssueMasters.FindAsync(issueMasterId);

                if (existIssueMaster != null)
                {
                    existIssueMaster.Status = issueMaster.Status;
                    existIssueMaster.ApprovedBy = issueMaster.ApprovedBy;
                    existIssueMaster.ApprovedUserId = issueMaster.ApprovedUserId;
                    existIssueMaster.ApprovedDate = issueMaster.ApprovedDate;

                    /*_dbContext.Entry(existRequisitionMaster).CurrentValues.SetValues(requisitionMaster);*/
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IssueMaster> GetIssueMasterByIssueMasterId(int issueMasterId)
        {
            try
            {
                var requisitionMaster = await _dbContext.IssueMasters
                    .Where(rm => rm.IssueMasterId == issueMasterId)
                    .Include(im => im.RequisitionMaster)
                    .Include(rm => rm.IssueDetails)
                    .ThenInclude(rd => rd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(rm => rm.IssueDetails)
                    .ThenInclude(id => id.Batch)
                    .FirstOrDefaultAsync();

                return requisitionMaster;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<IssueMaster>> GetIssueMastersByUserId(int userId)
        {
            try
            {
                var issueMasters = await _dbContext.IssueMasters
                    .Where(rm => rm.CreatedUserId == userId)
                    .Include(im => im.RequisitionMaster)
                    .Include(im => im.IssueDetails)
                    .ThenInclude(id => id.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(im => im.IssueDetails)
                    .ThenInclude(id => id.Batch)
                    .ToListAsync();

                if (issueMasters.Any())
                {
                    return issueMasters;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<IssueMaster>> GetIssueMastersByRequisitionMasterId(int requisitionMasterId)
        {
            try
            {
                var issueMasters = await _dbContext.IssueMasters
                    .Where(rm => rm.RequisitionMasterId == requisitionMasterId)
                    .Include(im => im.RequisitionMaster)
                    .Include(im=> im.IssueDetails)
                    .ThenInclude(id=>id.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(im=> im.IssueDetails)
                    .ThenInclude(id => id.Batch)
                    .ToListAsync();

                return issueMasters.Any() ? issueMasters : null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
