using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class RequisitionDetailService : IRequisitionDetailService
    {
        private readonly IRequisitionDetailRepository _requisitionDetailRepository;
        public RequisitionDetailService(IRequisitionDetailRepository requisitionDetailRepository)
        {
            _requisitionDetailRepository = requisitionDetailRepository;
        }

        public async Task AddRequisitionDetail(RequisitionDetail requisitionDetail)
        {
            await _requisitionDetailRepository.AddRequisitionDetail(requisitionDetail);
        }
    }
}
