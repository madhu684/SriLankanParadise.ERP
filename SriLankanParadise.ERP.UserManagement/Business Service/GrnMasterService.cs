using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
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
    }
}
