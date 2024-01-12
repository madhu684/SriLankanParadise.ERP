using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IPurchaseOrderService
    {
        Task AddPurchaseOrder(PurchaseOrder purchaseOrder);

        Task<IEnumerable<PurchaseOrder>> GetAll();
    }
}
