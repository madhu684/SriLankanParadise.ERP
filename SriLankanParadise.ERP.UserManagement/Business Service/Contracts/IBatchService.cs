using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IBatchService
    {
        Task AddBatch(Batch batch);
        Task<Batch> GetBatchById(int batchId);

        Task<IEnumerable<Batch>> GetAll();

        Task<IEnumerable<Batch>> GetBatchesByCompanyId(int companyId);
        Task<Batch> GetBatchesByBatchRef(string batchRef);

    }
}
