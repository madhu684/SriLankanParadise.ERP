using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class IssueDetailRepository: IIssueDetailRepository

    {
        private readonly ErpSystemContext _dbContext;

        public IssueDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddIssueDetail(IssueDetail issueDetail)
        {
            try
            {
                _dbContext.IssueDetails.Add(issueDetail);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<IssueDetail>> GetIssueDetails(int issueMasterId)
        {
            try
            {
                var issueDetails = await _dbContext.IssueDetails
                    .Include(r => r.ItemMaster)
                    //.Include(r => r.Batch)
                    .Where(r => r.IssueMasterId == issueMasterId)
                    .ToListAsync();

                return issueDetails.Any() ? issueDetails : new List<IssueDetail>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<IssueDetail>> UpdateIssueDetailReceivedAndReturnedQuantity(int issueMasterId, List<IssueDetail> issueDetails)
        {
            try
            {
                var updatedIssueDetails = new List<IssueDetail>();


                foreach (var issueDetail in issueDetails)
                {
                    var existingIssueDetail = await _dbContext.IssueDetails
                        .FirstOrDefaultAsync(r => r.IssueMasterId == issueMasterId && r.IssueDetailId == issueDetail.IssueDetailId);

                    if (existingIssueDetail != null)
                    {
                        existingIssueDetail.ReceivedQuantity = issueDetail.ReceivedQuantity;
                        existingIssueDetail.ReturnedQuantity = issueDetail.ReturnedQuantity;

                        await _dbContext.SaveChangesAsync();

                        var updatedDetail = await _dbContext.IssueDetails
                            .Include(r => r.ItemMaster)
                            .FirstOrDefaultAsync(r => r.IssueDetailId == issueDetail.IssueDetailId);

                        if (updatedDetail != null)
                        {
                            updatedIssueDetails.Add(updatedDetail);
                        }
                    }
                }

                return updatedIssueDetails;
            }
            catch (Exception ex)
            {

                throw;
            }

        }
    }
}
