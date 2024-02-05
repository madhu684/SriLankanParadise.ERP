using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class GrnDetailService : IGrnDetailService
    {
        private readonly IGrnDetailRepository _grnDetailRepository;
        public GrnDetailService(IGrnDetailRepository grnDetailRepository)
        {
            _grnDetailRepository = grnDetailRepository;
        }

        public async Task AddGrnDetail(GrnDetail grnDetail)
        {
            await _grnDetailRepository.AddGrnDetail(grnDetail);
        }

        public async Task<GrnDetail> GetGrnDetailByGrnDetailId(int grnDetailId)
        {
            return await _grnDetailRepository.GetGrnDetailByGrnDetailId(grnDetailId);
        }

        public async Task UpdateGrnDetail(int grnDetailId, GrnDetail grnDetail)
        {
            await _grnDetailRepository.UpdateGrnDetail(grnDetailId, grnDetail);
        }

        public async Task DeleteGrnDetail(int grnDetailId)
        {
            await _grnDetailRepository.DeleteGrnDetail(grnDetailId);
        }
    }
}
