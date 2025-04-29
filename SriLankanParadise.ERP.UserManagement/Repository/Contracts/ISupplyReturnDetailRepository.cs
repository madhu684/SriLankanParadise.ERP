using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISupplyReturnDetailRepository
    {
        Task AddSupplyReturnDetail(SupplyReturnDetail supplyReturnDetail);
        Task <SupplyReturnDetail> GetSupplyReturnDetailByReturnId(int supplyReturnDetailId);
        Task UpdateSupplyReturnDetail(int supplyReturnDetailId, SupplyReturnDetail supplyReturnDetail);
        Task DeleteSupplyReturnDetail(int supplyReturnDetailId);
    }
}
