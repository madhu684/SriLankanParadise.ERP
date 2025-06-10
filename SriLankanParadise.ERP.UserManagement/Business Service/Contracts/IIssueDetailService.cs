using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IIssueDetailService
    {
        Task AddIssueDetail(IssueDetail issueDetail);

        Task<List<IssueDetail>> UpdateIssueDetailReceivedQuantity(int issueMasterId, List<IssueDetail> issueDetailReceivedQtyUpdate);
    }
}
