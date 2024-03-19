using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemBatchService : IItemBatchService
    {
        private readonly IItemBatchRepository _itemBatchRepository;
        public ItemBatchService(IItemBatchRepository itemBatchRepository)
        {
            _itemBatchRepository = itemBatchRepository;
        }

        public async Task AddItemBatch(ItemBatch itemBatch)
        {
            await _itemBatchRepository.AddItemBatch(itemBatch);
        }

        public async Task<IEnumerable<ItemBatch>> GetAll()
        {
            return await _itemBatchRepository.GetAll();
        }

        public async Task<IEnumerable<ItemBatch>> GetItemBatchesByCompanyId(int companyId)
        {
            return await _itemBatchRepository.GetItemBatchesByCompanyId(companyId);
        }


        public async Task<IEnumerable<ItemBatch>> GetItemBatchesByUserId(int userId)
        {
            return await _itemBatchRepository.GetItemBatchesByUserId(userId);
        }

        public async Task<ItemBatch> GetItemBatchByBatchIdAndItemMasterId(int batchId, int itemMasterId)
        {
            return await _itemBatchRepository.GetItemBatchByBatchIdAndItemMasterId(batchId, itemMasterId);
        }

        public async Task<IEnumerable<ItemBatch>> GetItemBatchesByItemMasterId(int itemMasterId, int companyId)
        {
            return await _itemBatchRepository.GetItemBatchesByItemMasterId(itemMasterId, companyId);
        }

        public async Task UpdateItemBatch(int batchId, int itemMasterId, ItemBatch itemBatch)
        {
            await _itemBatchRepository.UpdateItemBatch(batchId, itemMasterId, itemBatch);
        }
    }
}
