using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPurchaseOrderRepository
    {
        Task AddPurchaseOrder(PurchaseOrder purchaseOrder);

        Task<IEnumerable<PurchaseOrder>> GetAll();

        Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersByUserId(int userId);

        Task ApprovePurchaseOrder(int purchaseOrderId, PurchaseOrder purchaseOrder);

        Task<PurchaseOrder> GetPurchaseOrderByPurchaseOrderId(int purchaseOrderId);

        Task UpdatePurchaseOrder(int purchaseOrderId, PurchaseOrder purchaseOrder);

        Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersByCompanyId(int companyId);
        Task DeletePurchaseOrder(int purchaseOrderId);
    }
}
