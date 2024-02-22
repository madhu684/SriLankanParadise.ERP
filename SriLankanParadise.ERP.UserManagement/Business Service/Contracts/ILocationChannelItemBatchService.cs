using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationChannelItemBatchService
    {
        Task AddLocationChannelItemBatch(LocationChannelItemBatch locationChannelItemBatch);
    }
}
