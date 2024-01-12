using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IPurchaseRequisitionDetailService 
    {
        Task AddPurchaseRequisitionDetail(PurchaseRequisitionDetail purchaseRequisitionDetail);
    }
}
