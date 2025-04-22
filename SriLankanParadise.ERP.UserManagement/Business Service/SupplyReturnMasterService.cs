using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SupplyReturnMasterService : ISupplyReturnMasterService
    {
        private readonly ISupplyReturnMasterRepository _repository;

        public SupplyReturnMasterService(ISupplyReturnMasterRepository repository)
        {
            _repository = repository;
        }
        public async Task AddSupplyReturnMaster(SupplyReturnMaster supplyReturnMaster)
        {
            await _repository.AddSupplyReturnMaster(supplyReturnMaster);
        }

        public async Task ApproveSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMaster supplyReturnMaster)
        {
            await _repository.ApproveSupplyReturnMaster(supplyReturnMasterId, supplyReturnMaster);
        }

        public async Task<IEnumerable<SupplyReturnMaster>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<IEnumerable<SupplyReturnMaster>> GetApprovedSupplyReturnMasterByCompanyId(int companyId)
        {
            return await _repository.GetApprovedSupplyReturnMasterByCompanyId(companyId);
        }

        public async Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterByCompanyId(int companyId)
        {
            return await _repository.GetSupplyReturnMasterByCompanyId(companyId);
        }

        public async Task<SupplyReturnMaster> GetSupplyReturnMasterBySupplyReturnMasterId(int supplyReturnMasterId)
        {
            return await _repository.GetSupplyReturnMasterBySupplyReturnMasterId(supplyReturnMasterId);
        }

        public async Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterByUserId(int userId)
        {
            return await _repository.GetSupplyReturnMasterByUserId(userId);
        }

        public async Task UpdateSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMaster supplyReturnMaster)
        {
            await _repository.UpdateSupplyReturnMaster(supplyReturnMasterId, supplyReturnMaster);
        }
    }
}
