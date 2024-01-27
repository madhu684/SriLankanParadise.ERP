using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;
        public PurchaseOrderService(IPurchaseOrderRepository purchaseOrderRepository)
        {
            _purchaseOrderRepository = purchaseOrderRepository;
        }

        public async Task AddPurchaseOrder(PurchaseOrder purchaseOrder)
        {
            await _purchaseOrderRepository.AddPurchaseOrder(purchaseOrder);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAll()
        {
            return await _purchaseOrderRepository.GetAll();
        }
    }
}
