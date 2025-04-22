using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SupplyReturnDetailService : ISupplyReturnDetailService
    {
        private readonly ISupplyReturnDetailRepository _supplyReturnDetailRepository;

        public SupplyReturnDetailService(ISupplyReturnDetailRepository supplyReturnDetailRepository)
        {
            _supplyReturnDetailRepository = supplyReturnDetailRepository;
        }

        public async Task AddSupplyReturnDetail(SupplyReturnDetail supplyReturnDetail)
        {
            await _supplyReturnDetailRepository.AddSupplyReturnDetail(supplyReturnDetail);
        }

        public async Task DeleteSupplyReturnDetail(int supplyReturnDetailId)
        {
            await _supplyReturnDetailRepository.DeleteSupplyReturnDetail(supplyReturnDetailId);
        }

        public async Task<SupplyReturnDetail> GetSupplyReturnDetailByReturnId(int supplyReturnDetailId)
        {
            return await _supplyReturnDetailRepository.GetSupplyReturnDetailByReturnId(supplyReturnDetailId);
        }

        public async Task UpdateSupplyReturnDetail(int supplyReturnDetailId, SupplyReturnDetail supplyReturnDetail)
        {
            await _supplyReturnDetailRepository.UpdateSupplyReturnDetail(supplyReturnDetailId, supplyReturnDetail);
        }
    }
}
