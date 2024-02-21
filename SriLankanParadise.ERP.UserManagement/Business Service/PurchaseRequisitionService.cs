using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class PurchaseRequisitionService : IPurchaseRequisitionService
    {
        private readonly IPurchaseRequisitionRepository _purchaseRequisitionRepository;
        public PurchaseRequisitionService(IPurchaseRequisitionRepository purchaseRequisitionRepository)
        {
            _purchaseRequisitionRepository = purchaseRequisitionRepository;
        }

        public async Task AddPurchaseRequisition(PurchaseRequisition purchaseRequisition)
        {
            await _purchaseRequisitionRepository.AddPurchaseRequisition(purchaseRequisition);
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetAll()
        {
            return await _purchaseRequisitionRepository.GetAll();
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetPurchaseRequisitionsWithoutDraftsByCompanyId(int companyId)
        {
            return await _purchaseRequisitionRepository.GetPurchaseRequisitionsWithoutDraftsByCompanyId(companyId);
        }

        public async Task ApprovePurchaseRequisition(int purchaseRequisitionId, PurchaseRequisition purchaseRequisition)
        {
            await _purchaseRequisitionRepository.ApprovePurchaseRequisition(purchaseRequisitionId, purchaseRequisition);
        }

        public async Task<PurchaseRequisition> GetPurchaseRequisitionByPurchaseRequisitionId(int purchaseRequisitionId)
        {
            return await _purchaseRequisitionRepository.GetPurchaseRequisitionByPurchaseRequisitionId(purchaseRequisitionId);
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetPurchaseRequisitionsByUserId(int userId)
        {
            return await _purchaseRequisitionRepository.GetPurchaseRequisitionsByUserId(userId);
        }

        public async Task UpdatePurchaseRequisition(int purchaseRequisitionId, PurchaseRequisition purchaseRequisition)
        {
            await _purchaseRequisitionRepository.UpdatePurchaseRequisition(purchaseRequisitionId, purchaseRequisition);
        }

    }
}
