using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IPurchaseRequisitionService
    {
        Task AddPurchaseRequisition(PurchaseRequisition purchaseRequisition);

        Task<IEnumerable<PurchaseRequisition>> GetAll();

        Task<IEnumerable<PurchaseRequisition>> GetPurchaseRequisitionsWithoutDraftsByCompanyId(int companyId);

        Task ApprovePurchaseRequisition(int purchaseRequisitionId, PurchaseRequisition purchaseRequisition);

        Task<PurchaseRequisition> GetPurchaseRequisitionByPurchaseRequisitionId(int purchaseRequisitionId);

        Task<IEnumerable<PurchaseRequisition>> GetPurchaseRequisitionsByUserId(int userId);

        Task UpdatePurchaseRequisition(int purchaseRequisitionId, PurchaseRequisition purchaseRequisition);
    }
}
