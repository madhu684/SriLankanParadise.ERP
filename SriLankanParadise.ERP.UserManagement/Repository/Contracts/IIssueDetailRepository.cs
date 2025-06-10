using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IIssueDetailRepository
    {
        Task AddIssueDetail(IssueDetail issueDetail);
        Task<List<IssueDetail>> UpdateIssueDetailReceivedQuantity(int issueMasterId, List<IssueDetail> issueDetails);
    }
}
