using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPurchaseOrderDetailRepository
    {
        Task AddPurchaseOrderDetail(PurchaseOrderDetail purchaseOrderDetail);
    }
}
