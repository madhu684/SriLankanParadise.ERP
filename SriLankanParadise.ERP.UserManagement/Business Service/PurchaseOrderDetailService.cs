using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
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
    }
}
