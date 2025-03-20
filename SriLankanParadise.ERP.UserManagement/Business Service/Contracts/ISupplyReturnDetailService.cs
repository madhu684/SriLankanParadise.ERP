using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISupplyReturnDetailService
    {
        Task AddSupplyReturnDetail(SupplyReturnDetail supplyReturnDetail);
        Task<SupplyReturnDetail> GetSupplyReturnDetailByReturnId(int supplyReturnDetailId);
        Task UpdateSupplyReturnDetail(int supplyReturnDetailId, SupplyReturnDetail supplyReturnDetail);
        Task DeleteSupplyReturnDetail(int supplyReturnDetailId);
    }
}
