using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class BatchHasGrnMasterService : IBatchHasGrnMasterService
    {
        private readonly IBatchHasGrnMasterRepository _batchHasGrnMasterRepository;
        public BatchHasGrnMasterService(IBatchHasGrnMasterRepository batchHasGrnMasterRepository)
        {
            _batchHasGrnMasterRepository = batchHasGrnMasterRepository;
        }

        public async Task AddBatchHasGrnMaster(BatchHasGrnMaster batchHasGrnMaster)
        {
            await _batchHasGrnMasterRepository.AddBatchHasGrnMaster(batchHasGrnMaster);
        }
    }
}
