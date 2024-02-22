using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class PurchaseOrderDetailService : IPurchaseOrderDetailService
    {
        private readonly IPurchaseOrderDetailRepository _purchaseOrderDetailRepository;
        public PurchaseOrderDetailService(IPurchaseOrderDetailRepository purchaseOrderDetailRepository)
        {
            _purchaseOrderDetailRepository = purchaseOrderDetailRepository;
        }

        public async Task AddPurchaseOrderDetail(PurchaseOrderDetail purchaseOrderDetail)
        {
            await _purchaseOrderDetailRepository.AddPurchaseOrderDetail(purchaseOrderDetail);
        }

        public async Task<PurchaseOrderDetail> GetPurchaseOrderDetailByPurchaseOrderDetailId(int purchaseOrderDetailId)
        {
            return await _purchaseOrderDetailRepository.GetPurchaseOrderDetailByPurchaseOrderDetailId(purchaseOrderDetailId);
        }

        public async Task UpdatePurchaseOrderDetail(int purchaseOrderDetailId, PurchaseOrderDetail purchaseOrderDetail)
        {
            await _purchaseOrderDetailRepository.UpdatePurchaseOrderDetail(purchaseOrderDetailId, purchaseOrderDetail);
        }

        public async Task DeletePurchaseOrderDetail(int purchaseOrderDetailId)
        {
            await _purchaseOrderDetailRepository.DeletePurchaseOrderDetail(purchaseOrderDetailId);
        }
    }
}
