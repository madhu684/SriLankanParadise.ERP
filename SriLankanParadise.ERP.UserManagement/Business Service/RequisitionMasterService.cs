using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class RequisitionMasterService : IRequisitionMasterService
    {
        private readonly IRequisitionMasterRepository _requisitionMasterRepository;
        public RequisitionMasterService(IRequisitionMasterRepository requisitionMasterRepository)
        {
            _requisitionMasterRepository = requisitionMasterRepository;
        }

        public async Task AddRequisitionMaster(RequisitionMaster requisitionMaster)
        {
            await _requisitionMasterRepository.AddRequisitionMaster(requisitionMaster);
        }

        public async Task<IEnumerable<RequisitionMaster>> GetAll()
        {
            return await _requisitionMasterRepository.GetAll();
        }

        public async Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersWithoutDraftsByCompanyId(int companyId)
        {
            return await _requisitionMasterRepository.GetRequisitionMastersWithoutDraftsByCompanyId(companyId);
        }

        public async Task ApproveRequisitionMaster(int requisitionMasterId, RequisitionMaster requisitionMaster)
        {
            await _requisitionMasterRepository.ApproveRequisitionMaster(requisitionMasterId, requisitionMaster);
        }

        public async Task<RequisitionMaster> GetRequisitionMasterByRequisitionMasterId(int requisitionMasterId)
        {
            return await _requisitionMasterRepository.GetRequisitionMasterByRequisitionMasterId(requisitionMasterId);
        }

        public async Task<IEnumerable<RequisitionMaster>> GetRequisitionMastersByUserId(int userId)
        {
            return await _requisitionMasterRepository.GetRequisitionMastersByUserId(userId);
        }

    }
}
