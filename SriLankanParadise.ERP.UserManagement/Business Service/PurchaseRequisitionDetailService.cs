using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class PurchaseRequisitionDetailService : IPurchaseRequisitionDetailService
    {
        private readonly IPurchaseRequisitionDetailRepository _purchaseRequisitionDetailRepository;
        public PurchaseRequisitionDetailService(IPurchaseRequisitionDetailRepository purchaseRequisitionDetailRepository)
        {
            _purchaseRequisitionDetailRepository = purchaseRequisitionDetailRepository;
        }

        public async Task AddPurchaseRequisitionDetail(PurchaseRequisitionDetail purchaseRequisitionDetail)
        {
            await _purchaseRequisitionDetailRepository.AddPurchaseRequisitionDetail(purchaseRequisitionDetail);
        }

        public async Task<PurchaseRequisitionDetail> GetPurchaseRequisitionDetailByPurchaseRequisitionDetailId(int purchaseRequisitionDetailId)
        {
            return await _purchaseRequisitionDetailRepository.GetPurchaseRequisitionDetailByPurchaseRequisitionDetailId(purchaseRequisitionDetailId);
        }

        public async Task UpdatePurchaseRequisitionDetail(int purchaseRequisitionDetailId, PurchaseRequisitionDetail purchaseRequisitionDetail)
        {
            await _purchaseRequisitionDetailRepository.UpdatePurchaseRequisitionDetail(purchaseRequisitionDetailId, purchaseRequisitionDetail);
        }

        public async Task DeletePurchaseRequisitionDetail(int purchaseRequisitionDetailId)
        {
            await _purchaseRequisitionDetailRepository.DeletePurchaseRequisitionDetail(purchaseRequisitionDetailId);
        }
    }
}
