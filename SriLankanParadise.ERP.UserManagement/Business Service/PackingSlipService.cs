using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class PackingSlipService : IPackingSlipService
    {
        private readonly IPackingSlipRepository _packingSlipRepository;

        public PackingSlipService(IPackingSlipRepository packingSlipRepository)
        {
            _packingSlipRepository = packingSlipRepository;
        }

        public async Task AddPackingSlip(PackingSlip packingSlip)
        {
            await _packingSlipRepository.AddPackingSlip(packingSlip);
        }

        public async Task ApprovePackingSlip(int packingSlipId, PackingSlip packingSlip)
        {
            await _packingSlipRepository.ApprovePackingSlip(packingSlipId, packingSlip);
        }

        public async Task<IEnumerable<PackingSlip>> GetAll()
        {
            return await _packingSlipRepository.GetAll();
        }

        public async Task<PackingSlip> GetPackingSlipByPackingSlipId(int packingSlipId)
        {
            return await _packingSlipRepository.GetPackingSlipByPackingSlipId(packingSlipId);
        }

        public async Task<IEnumerable<PackingSlip>> GetPackingSlipsByUserId(int userId)
        {
            return await _packingSlipRepository.GetPackingSlipsByUserId(userId);
        }

        public async Task<IEnumerable<PackingSlip>> GetPackingSlipsWithoutDraftsByCompanyId(int companyId)
        {
            return await _packingSlipRepository.GetPackingSlipsWithoutDraftsByCompanyId(companyId);
        }

        public async Task UpdatePackingSlip(int packingSlipId, PackingSlip packingSlip)
        {
            await _packingSlipRepository.UpdatePackingSlip(packingSlipId, packingSlip);
        }
    }
}