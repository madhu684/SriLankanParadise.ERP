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
    }
}
