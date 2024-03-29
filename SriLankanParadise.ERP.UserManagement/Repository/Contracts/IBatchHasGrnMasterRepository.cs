using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IBatchHasGrnMasterRepository
    {
        Task AddBatchHasGrnMaster(BatchHasGrnMaster batchHasGrnMaster);
    }
}
