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

        public async Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersWithoutDraftsByCompanyId(int companyId)
        {
            return await _purchaseOrderRepository.GetPurchaseOrdersWithoutDraftsByCompanyId(companyId);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersByUserId(int userId)
        {
            return await _purchaseOrderRepository.GetPurchaseOrdersByUserId(userId);
        }

        public async Task ApprovePurchaseOrder(int purchaseOrderId, PurchaseOrder purchaseOrder)
        {
            await _purchaseOrderRepository.ApprovePurchaseOrder(purchaseOrderId, purchaseOrder);
        }

        public async Task<PurchaseOrder> GetPurchaseOrderByPurchaseOrderId(int purchaseOrderId)
        {
            return await _purchaseOrderRepository.GetPurchaseOrderByPurchaseOrderId(purchaseOrderId);
        }

        public async Task UpdatePurchaseOrder(int purchaseOrderId, PurchaseOrder purchaseOrder)
        {
            await _purchaseOrderRepository.UpdatePurchaseOrder(purchaseOrderId, purchaseOrder);
        }

        public async Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersByCompanyId(int companyId)
        {
            return await _purchaseOrderRepository.GetPurchaseOrdersByCompanyId(companyId);
        }

        public async Task DeletePurchaseOrder(int purchaseOrderId)
        {
            await _purchaseOrderRepository.DeletePurchaseOrder(purchaseOrderId);
        }
    }
}
