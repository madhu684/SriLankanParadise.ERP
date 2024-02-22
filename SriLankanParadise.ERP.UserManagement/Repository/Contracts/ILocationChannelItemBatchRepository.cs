using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ILocationChannelItemBatchRepository
    {
        Task AddLocationChannelItemBatch(LocationChannelItemBatch locationChannelItemBatch);
    }
}
