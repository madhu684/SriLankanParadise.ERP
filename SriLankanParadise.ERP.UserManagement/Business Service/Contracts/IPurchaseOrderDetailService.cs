using SriLankanParadise.ERP.UserManagement.DataModels;
using System.Threading.Tasks;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IPurchaseOrderDetailService
    {
        Task AddPurchaseOrderDetail(PurchaseOrderDetail purchaseOrderDetail);

        Task<PurchaseOrderDetail> GetPurchaseOrderDetailByPurchaseOrderDetailId(int purchaseOrderDetailId);

        Task UpdatePurchaseOrderDetail(int purchaseOrderDetailId, PurchaseOrderDetail purchaseOrderDetail);

        Task DeletePurchaseOrderDetail(int purchaseOrderDetailId);
    }
}
