using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISupplyReturnMasterService
    {
        Task AddSupplyReturnMaster(SupplyReturnMaster supplyReturnMaster);
        Task<IEnumerable<SupplyReturnMaster>> GetAll();
        Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterByCompanyId(int companyId);
        Task<IEnumerable<SupplyReturnMaster>> GetApprovedSupplyReturnMasterByCompanyId(int companyId);

        Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterByUserId(int userId);

        Task<SupplyReturnMaster> GetSupplyReturnMasterBySupplyReturnMasterId(int supplyReturnMasterId);

        Task ApproveSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMaster supplyReturnMaster);

        Task UpdateSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMaster supplyReturnMaster);
    }
}
