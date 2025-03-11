using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemBatchService
    {
        Task AddItemBatch(ItemBatch itemBatch);

        Task<IEnumerable<ItemBatch>> GetAll();

        Task<IEnumerable<ItemBatch>> GetItemBatchesByCompanyId(int companyId);

        Task<IEnumerable<ItemBatch>> GetItemBatchesByLocationIdCompanyId(int locationId, int companyId);

        Task<IEnumerable<ItemBatch>> GetItemBatchesByUserId(int userId);

        Task<ItemBatch> GetItemBatchByBatchIdAndItemMasterId(int batchId, int itemMasterId);

        Task<IEnumerable<ItemBatch>> GetItemBatchesByItemMasterId(int itemMasterId, int companyId);

        Task UpdateItemBatch(int batchId, int itemMasterId, ItemBatch itemBatch);

        Task UpdateItemBatchQty(int batchId, int itemMasterId, ItemBatch itemBatch, string operation);
    }
}
