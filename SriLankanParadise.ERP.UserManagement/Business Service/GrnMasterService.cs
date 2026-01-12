using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class GrnMasterService : IGrnMasterService
    {
        private readonly IGrnMasterRepository _grnMasterRepository;
        public GrnMasterService(IGrnMasterRepository grnMasterRepository)
        {
            _grnMasterRepository = grnMasterRepository;
        }

        public async Task AddGrnMaster(GrnMaster grnMaster)
        {
            await _grnMasterRepository.AddGrnMaster(grnMaster);
        }

        public async Task<IEnumerable<GrnMaster>> GetAll()
        {
            return await _grnMasterRepository.GetAll();
        }

        public async Task<IEnumerable<GrnMaster>> GetGrnMastersWithoutDraftsByCompanyId(int companyId)
        {
            return await _grnMasterRepository.GetGrnMastersWithoutDraftsByCompanyId(companyId);
        }

        public async Task<IEnumerable<GrnMaster>> GetGrnMastersByUserId(int userId)
        {
            return await _grnMasterRepository.GetGrnMastersByUserId(userId);
        }

        public async Task<GrnMaster> GetGrnMasterByGrnMasterId(int grnMasterId)
        {
            return await _grnMasterRepository.GetGrnMasterByGrnMasterId(grnMasterId);
        }

        public async Task ApproveGrnMaster(int grnMasterId, GrnMaster grnMaster)
        {
            await _grnMasterRepository.ApproveGrnMaster(grnMasterId, grnMaster);
        }

        public async Task UpdateGrnMaster(int grnMasterId, GrnMaster grnMaster)
        {
            await _grnMasterRepository.UpdateGrnMaster(grnMasterId, grnMaster);
        }

        public async Task<IEnumerable<GrnMaster>> GetGrnMastersByPurchaseOrderId(int purchaseOrderId)
        {
            return await _grnMasterRepository.GetGrnMastersByPurchaseOrderId(purchaseOrderId);
        }

        public async Task<PagedResult<GrnMaster>> GetPaginatedGrnMastersByUserCompany(int CompanyId, string? filter = null, int pageNumber = 1, int pageSize = 10)
        {
            return await _grnMasterRepository.GetPaginatedGrnMastersByUserCompany(CompanyId, filter, pageNumber, pageSize);
        }
    }
}
