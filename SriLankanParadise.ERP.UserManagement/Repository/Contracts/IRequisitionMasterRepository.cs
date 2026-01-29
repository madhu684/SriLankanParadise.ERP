using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IRequisitionMasterRepository
    {
        Task AddRequisitionMaster(RequisitionMaster requisitionMaster);

        Task<IEnumerable<RequisitionMaster>> GetAll();

        Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersWithoutDraftsByCompanyId(int companyId);

        Task ApproveRequisitionMaster(int requisitionMasterId, RequisitionMaster requisitionMaster);

        Task PatchMinApproved(int requisitionMasterId, RequisitionMaster requisitionMaster);

        Task<RequisitionMaster> GetRequisitionMasterByRequisitionMasterId(int requisitionMasterId);

        Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersByUserId(int userId);

        Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersWithFiltersByCompanyId(int companyId, DateTime? date = null, int? requestedToLocationId = null, int? requestedFromLocationId = null, string? issueType = null);

    }
}
