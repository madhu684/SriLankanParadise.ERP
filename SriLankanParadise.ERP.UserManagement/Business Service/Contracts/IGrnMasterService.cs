using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IGrnMasterService
    {
        Task AddGrnMaster(GrnMaster grnMaster);

        Task<IEnumerable<GrnMaster>> GetAll();

        Task<IEnumerable<GrnMaster>> GetGrnMastersWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<GrnMaster>> GetGrnMastersByUserId(int userId);

        Task<GrnMaster> GetGrnMasterByGrnMasterId(int grnMasterId);

        Task ApproveGrnMaster(int grnMasterId, GrnMaster grnMaster);

        Task UpdateGrnMaster(int grnMasterId, GrnMaster grnMaster);
    }
}
