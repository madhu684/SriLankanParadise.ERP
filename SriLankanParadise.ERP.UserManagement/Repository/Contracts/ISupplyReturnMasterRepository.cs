using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISupplyReturnMasterRepository
    {
        Task AddSupplyReturnMaster(SupplyReturnMaster supplyReturnMaster);
        Task<IEnumerable<SupplyReturnMaster>> GetAll();
        Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterByCompanyId(int companyId);

        Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterByUserId(int userId);

        Task<SupplyReturnMaster> GetSupplyReturnMasterBySupplyReturnMasterId(int supplyReturnMasterId);

        Task ApproveSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMaster supplyReturnMaster);

        Task UpdateSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMaster supplyReturnMaster);

        //Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterBySupplierId(int supplierId);
    }
}
