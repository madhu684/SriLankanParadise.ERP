using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPurchaseOrderDetailRepository
    {
        Task AddPurchaseOrderDetail(PurchaseOrderDetail purchaseOrderDetail);

        Task<PurchaseOrderDetail> GetPurchaseOrderDetailByPurchaseOrderDetailId(int purchaseOrderDetailId);

        Task UpdatePurchaseOrderDetail(int purchaseOrderDetailId, PurchaseOrderDetail purchaseOrderDetail);

        Task DeletePurchaseOrderDetail(int purchaseOrderDetailId);
    }
}
