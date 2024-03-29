using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IBatchRepository
    {
        Task AddBatch(Batch batch);

        Task<IEnumerable<Batch>> GetAll();

        Task<IEnumerable<Batch>> GetBatchesByCompanyId(int companyId);
    }
}
