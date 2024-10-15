using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IIssueDetailRepository
    {
        Task AddIssueDetail(IssueDetail issueDetail);

        Task<IEnumerable<IssueDetail>> GetIssueDetails(int issueMasterId);
    }
}
