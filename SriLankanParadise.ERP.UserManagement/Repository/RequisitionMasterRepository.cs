using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

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

        public async Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersWithoutDraftsByCompanyId(int companyId, int? status = null, int? requestedToLocationId = null, int? requestedFromLocationId = null, string? issueType = null)
        {
            try
            {
                var query = _dbContext.RequisitionMasters
                    .AsNoTracking()
                    .Where(rm => rm.Status != 0 && rm.CompanyId == companyId);

                if (status.HasValue)
                {
                    query = query.Where(rm => rm.Status == status.Value);
                }

                if (requestedToLocationId != null)
                {
                    query = query.Where(im => im.RequestedToLocationId == requestedToLocationId);
                }

                if (requestedFromLocationId != null)
                {
                    query = query.Where(im => im.RequestedFromLocationId == requestedFromLocationId);
                }

                if (!string.IsNullOrEmpty(issueType))
                {
                    var type = issueType.ToLower();
                    query = query.Where(im => im.RequisitionType != null && im.RequisitionType.ToLower() == type);
                }

                var requisitionMasters = await query
                    .Include(rm => rm.RequisitionDetails)
                        .ThenInclude(rd => rd.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(rm => rm.RequestedFromLocation)
                    .Include(rm => rm.RequestedToLocation)
                    .Include(rm => rm.IssueMasters)
                    .ToListAsync();

                return requisitionMasters.Any() ? requisitionMasters : null;
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

        public async Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersWithFiltersByCompanyId(int companyId, DateTime? date = null, int? requestedToLocationId = null, int? requestedFromLocationId = null, string? issueType = null)
        {
            try
            {
                var query = _dbContext.RequisitionMasters
                    .AsNoTracking()
                    .Where(im => im.Status != 0 && im.CompanyId == companyId);

                if (date.HasValue)
                {
                    var targetDate = date.Value.Date;
                    query = query.Where(im => im.Status == 2 || (im.RequisitionDate.HasValue && im.RequisitionDate.Value.Date == targetDate));
                }

                if (requestedToLocationId != null) 
                {
                    query = query.Where(im => im.RequestedToLocationId == requestedToLocationId);
                }

                if (requestedFromLocationId != null)
                {
                    query = query.Where(im => im.RequestedFromLocationId == requestedFromLocationId);
                }

                if (!string.IsNullOrEmpty(issueType))
                {
                    var type = issueType.ToLower();
                    query = query.Where(im => im.RequisitionType != null && im.RequisitionType.ToLower() == type);
                }

                var requisitionMasters = await query
                    .Include(rm => rm.RequisitionDetails)
                        .ThenInclude(rd => rd.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(rm => rm.RequestedFromLocation)
                    .Include(rm => rm.RequestedToLocation)
                    .Include(rm => rm.IssueMasters)
                    .OrderBy(rm => rm.Status)
                    .ToListAsync();

                return requisitionMasters.Any() ? requisitionMasters : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PagedResult<RequisitionMaster>> GetTrnReportByCompanyId(int companyId, int pageNumber, int pageSize, DateTime? fromDate = null, DateTime? toDate = null, int? warehouseLocationId = null, string? searchText = null, int? createdUserId = null)
        {
            try
            {
                var query = _dbContext.RequisitionMasters
                    .AsNoTracking()
                    .Where(rm => rm.Status != 0 && rm.CompanyId == companyId && rm.RequisitionType != null && rm.RequisitionType.ToLower() == "trn");

                if (fromDate.HasValue)
                {
                    var from = fromDate.Value.Date;
                    query = query.Where(rm => rm.RequisitionDate.HasValue && rm.RequisitionDate.Value.Date >= from);
                }

                if (toDate.HasValue)
                {
                    var to = toDate.Value.Date;
                    query = query.Where(rm => rm.RequisitionDate.HasValue && rm.RequisitionDate.Value.Date <= to);
                }

                if (warehouseLocationId.HasValue)
                {
                    query = query.Where(rm => rm.RequestedFromLocationId == warehouseLocationId.Value);
                }

                if (createdUserId.HasValue)
                {
                    query = query.Where(rm => rm.RequestedUserId == createdUserId.Value);
                }

                if (!string.IsNullOrEmpty(searchText))
                {
                    var search = searchText.ToLower();
                    query = query.Where(rm => 
                        (rm.ReferenceNumber != null && rm.ReferenceNumber.ToLower().Contains(search)) ||
                        (rm.IssueMasters.Any(im => im.ReferenceNumber != null && im.ReferenceNumber.ToLower().Contains(search)))
                    );
                }

                var totalCount = await query.CountAsync();
                var items = await query
                    .Include(rm => rm.RequestedFromLocation)
                    .Include(rm => rm.RequestedToLocation)
                    .Include(rm => rm.IssueMasters)
                    .OrderByDescending(rm => rm.RequisitionDate)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<RequisitionMaster>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
