using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemBatchRepository
    {
        Task AddItemBatch(ItemBatch itemBatch);

        Task<IEnumerable<ItemBatch>> GetAll();

        Task<IEnumerable<ItemBatch>> GetItemBatchesByCompanyId(int companyId);

        Task<ItemBatch> GetItemBatchByBatchIdAndItemMasterId(int batchId, int itemMasterId);

        /*Task<ItemBatch> GetItemBatchByItemBatchId(int itemBatchId);

        Task UpdateItemBatch(int itemBatchId, ItemBatch itemBatch);

        Task DeleteItemBatch(int itemBatchId);*/

        Task<IEnumerable<ItemBatch>> GetItemBatchesByUserId(int userId);

        Task<IEnumerable<ItemBatch>> GetItemBatchesByItemMasterId(int itemMasterId, int companyId);

        Task UpdateItemBatch(int batchId, int itemMasterId, ItemBatch itemBatch);
    }
}
