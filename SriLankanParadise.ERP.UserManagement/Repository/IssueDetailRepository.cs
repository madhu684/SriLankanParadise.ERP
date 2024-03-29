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
    }
}
