using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemBatchRepository
    {
        Task AddItemBatch(ItemBatch itemBatch);

        Task<IEnumerable<ItemBatch>> GetAll();

        Task<IEnumerable<ItemBatch>> GetItemBatchesByCompanyId(int companyId);

        /*Task<ItemBatch> GetItemBatchByItemBatchId(int itemBatchId);

        Task UpdateItemBatch(int itemBatchId, ItemBatch itemBatch);

        Task DeleteItemBatch(int itemBatchId);*/

        Task<IEnumerable<ItemBatch>> GetItemBatchesByUserId(int userId);
    }
}
