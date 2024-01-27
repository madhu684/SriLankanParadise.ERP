using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPurchaseRequisitionDetailRepository
    {
        Task AddPurchaseRequisitionDetail(PurchaseRequisitionDetail purchaseRequisitionDetail);
    }
}
