using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IIssueMasterService
    {
        Task AddIssueMaster(IssueMaster issueMaster);

        Task<IEnumerable<IssueMaster>> GetAll();

        Task<IEnumerable<IssueMaster>> GetIssueMastersWithoutDraftsByCompanyId(int companyId, DateTime? date = null, int? issuedLocationId = null, string? issueType = null);

        Task ApproveIssueMaster(int issueMasterId, IssueMaster issueMaster);

        Task<IssueMaster> GetIssueMasterByIssueMasterId(int issueMasterId);

        Task<IEnumerable<IssueMaster>> GetIssueMastersByUserId(int userId);

        Task<IEnumerable<IssueMaster>> GetIssueMastersByRequisitionMasterId(int requisitionMasterId);

        Task<IEnumerable<IssueMaster>> GetIssueMastersById(int id);

        Task<PagedResult<IssueMaster>> GetPaginatedIssueMastersByCompanyIdLocationDateRange(int companyId, string? issueType = null, int? locationId = null, DateTime? startDate = null, DateTime? endDate = null, int pageNumber = 1, int pageSize = 10);

    }
}
