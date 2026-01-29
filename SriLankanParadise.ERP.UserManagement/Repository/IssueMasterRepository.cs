using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
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
                    //.ThenInclude(id => id.Batch)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<IssueMaster>> GetIssueMastersWithoutDraftsByCompanyId(int companyId, DateTime? date = null, int? issuedLocationId = null, string? issueType = null)
        {
            try
            {
                var query = _dbContext.IssueMasters
                    .AsNoTracking()
                    .Where(im => im.Status != 0 && im.CompanyId == companyId);

                if (date.HasValue)
                {
                    var targetDate = date.Value.Date;
                    query = query.Where(im => im.Status == 41 || (im.IssueDate.HasValue && im.IssueDate.Value.Date == targetDate));
                }

                if (issuedLocationId.HasValue)
                {
                    query = query.Where(im => im.IssuedLocationId == issuedLocationId);
                }

                if (!string.IsNullOrEmpty(issueType))
                {
                    var type = issueType.ToLower();
                    query = query.Where(im => im.IssueType != null && im.IssueType.ToLower() == type);
                }

                var issueMasters = await query
                    .Include(im => im.RequisitionMaster)
                        .ThenInclude(rm => rm.RequisitionDetails)
                        .ThenInclude(rd => rd.ItemMaster)
                    .Include(im => im.RequisitionMaster)
                        .ThenInclude(rm => rm.RequestedFromLocation)
                    .Include(im => im.IssueDetails)
                        .ThenInclude(rd => rd.ItemMaster)
                            .ThenInclude(im => im.Unit)
                    .OrderByDescending(im => im.IssueDate)
                    .ToListAsync();

                return issueMasters.Any() ? issueMasters : null;
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
                    //.ThenInclude(id => id.Batch)
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
                    //.ThenInclude(id => id.Batch)
                    .OrderByDescending(im => im.IssueDate)
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
                    //.ThenInclude(id => id.Batch)
                    .ToListAsync();

                return issueMasters.Any() ? issueMasters : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<IssueMaster>> GetIssueMastersById(int id)
        {
            try
            {
                var issueMasters = await _dbContext.IssueMasters
                    .Where(rm => rm.IssueMasterId == id)
                    .Include(im => im.RequisitionMaster)
                    .Include(im => im.IssueDetails)
                    .ThenInclude(id => id.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(im => im.IssueDetails)
                    //.ThenInclude(id => id.Batch)
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
