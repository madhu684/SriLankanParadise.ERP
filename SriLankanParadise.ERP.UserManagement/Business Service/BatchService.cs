using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class BatchService : IBatchService
    {
        private readonly IBatchRepository _batchRepository;
        public BatchService(IBatchRepository batchRepository)
        {
            _batchRepository = batchRepository;
        }

        public async Task AddBatch(Batch batch)
        {
            await _batchRepository.AddBatch(batch);
        }

        public async Task<IEnumerable<Batch>> GetAll()
        {
            return await _batchRepository.GetAll();
        }

        public async Task<Batch> GetBatchById(int batchId)
        {
            return await _batchRepository.GetBatchById(batchId);
        }

        public async Task<IEnumerable<Batch>> GetBatchesByCompanyId(int companyId)
        {
            return await _batchRepository.GetBatchesByCompanyId(companyId);
        }

    }
}
