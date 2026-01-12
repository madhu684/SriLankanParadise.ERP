using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IGrnMasterRepository
    {
        Task AddGrnMaster(GrnMaster grnMaster);

        Task<IEnumerable<GrnMaster>> GetAll();

        Task<IEnumerable<GrnMaster>> GetGrnMastersWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<GrnMaster>> GetGrnMastersByUserId(int userId);

        Task<GrnMaster> GetGrnMasterByGrnMasterId(int grnMasterId);

        Task ApproveGrnMaster(int grnMasterId, GrnMaster grnMaster);

        Task UpdateGrnMaster(int grnMasterId, GrnMaster grnMaster);

        Task<IEnumerable<GrnMaster>> GetGrnMastersByPurchaseOrderId(int purchaseOrderId);

        Task<PagedResult<GrnMaster>> GetPaginatedGrnMastersByUserCompany(int CompanyId, string? filter = null, int pageNumber = 1, int pageSize = 10);
    }
}
