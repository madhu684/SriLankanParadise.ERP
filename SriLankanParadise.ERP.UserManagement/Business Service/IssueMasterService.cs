using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class IssueMasterService : IIssueMasterService
    {
        private readonly IIssueMasterRepository _issueMasterRepository;
        public IssueMasterService(IIssueMasterRepository issueMasterRepository)
        {
            _issueMasterRepository = issueMasterRepository;
        }

        public async Task AddIssueMaster(IssueMaster issueMaster)
        {
            await _issueMasterRepository.AddIssueMaster(issueMaster);
        }

        public async Task<IEnumerable<IssueMaster>> GetAll()
        {
            return await _issueMasterRepository.GetAll();
        }

        public async Task<IEnumerable<IssueMaster>> GetIssueMastersWithoutDraftsByCompanyId(int companyId, DateTime? date = null, int? issuedLocationId = null, string? issueType = null)
        {
            return await _issueMasterRepository.GetIssueMastersWithoutDraftsByCompanyId(companyId, date, issuedLocationId, issueType);
        }

        public async Task ApproveIssueMaster(int issueMasterId, IssueMaster issueMaster)
        {
            await _issueMasterRepository.ApproveIssueMaster(issueMasterId, issueMaster);
        }

        public async Task<IssueMaster> GetIssueMasterByIssueMasterId(int issueMasterId)
        {
            return await _issueMasterRepository.GetIssueMasterByIssueMasterId(issueMasterId);
        }

        public async Task<IEnumerable<IssueMaster>> GetIssueMastersByUserId(int userId)
        {
            return await _issueMasterRepository.GetIssueMastersByUserId(userId);
        }

        public async Task<IEnumerable<IssueMaster>> GetIssueMastersByRequisitionMasterId(int requisitionMasterId)
        {
            return await _issueMasterRepository.GetIssueMastersByRequisitionMasterId(requisitionMasterId);
        }
        
        public async Task<IEnumerable<IssueMaster>> GetIssueMastersById(int id)
        {
            return await _issueMasterRepository.GetIssueMastersById(id);
        }

        public async Task<PagedResult<IssueMaster>> GetPaginatedIssueMastersByCompanyIdLocationDateRange(int companyId, string? issueType = null, int? locationId = null, DateTime? startDate = null, DateTime? endDate = null, int pageNumber = 1, int pageSize = 10)
        {
            return await _issueMasterRepository.GetPaginatedIssueMastersByCompanyIdLocationDateRange(companyId, issueType, locationId, startDate, endDate, pageNumber, pageSize);
        }
    }
}
