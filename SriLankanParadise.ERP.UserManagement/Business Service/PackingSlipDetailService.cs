using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class PackingSlipDetailService : IPackingSlipDetailService
    {
        private readonly IPackingSlipDetailRepository _packingSlipDetailRepository;

        public PackingSlipDetailService(IPackingSlipDetailRepository packingSlipDetailRepository)
        {
            _packingSlipDetailRepository = packingSlipDetailRepository;
        }
        public async Task AddPackingSlipDetail(PackingSlipDetail packingSlipDetail)
        {
            await _packingSlipDetailRepository.AddPackingSlipDetail(packingSlipDetail);
        }

        public async Task DeletePackingSlipDetail(int packingSlipDetailId)
        {
            await _packingSlipDetailRepository.DeletePackingSlipDetail(packingSlipDetailId);
        }

        public Task<PackingSlipDetail> GetPackingSlipDetailByPackingSlipDetailId(int packingSlipDetailId)
        {
            return _packingSlipDetailRepository.GetPackingSlipDetailByPackingSlipDetailId(packingSlipDetailId);
        }

        public async Task<IEnumerable<PackingSlipDetail>> GetPackingSlipDetailsByPackingSlipId(int packingSlipId)
        {
            return await _packingSlipDetailRepository.GetPackingSlipDetailsByPackingSlipId(packingSlipId);
        }

        public async Task UpdatePackingSlipDetail(int packingSlipDetailId, PackingSlipDetail packingSlipDetail)
        {
            await _packingSlipDetailRepository.UpdatePackingSlipDetail(packingSlipDetailId, packingSlipDetail);
        }
    }
}