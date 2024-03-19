using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IRequisitionDetailRepository
    {
        Task AddRequisitionDetail(RequisitionDetail requisitionDetail);
    }
}
