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
                return await _dbContext.IssueDetails
                    .Where(x => x.IssueMasterId == issueMasterId)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
