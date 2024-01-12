using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPurchaseOrderRepository
    {
        Task AddPurchaseOrder(PurchaseOrder purchaseOrder);

        Task<IEnumerable<PurchaseOrder>> GetAll();
    }
}
