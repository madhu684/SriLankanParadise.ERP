using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemMasterService : IItemMasterService
    {
        private readonly IItemMasterRepository _itemMasterRepository;
        private readonly ISubItemMasterRepository _subItemMasterRepository;

        public ItemMasterService(IItemMasterRepository itemMasterRepository, ISubItemMasterRepository subItemMasterRepository)
        {
            _itemMasterRepository = itemMasterRepository;
            _subItemMasterRepository = subItemMasterRepository;
        }

        public async Task AddItemMaster(ItemMaster itemMaster)
        {
            await _itemMasterRepository.AddItemMaster(itemMaster);
        }

        public async Task<IEnumerable<ItemMaster>> GetAll()
        {
            return await _itemMasterRepository.GetAll();
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId)
        {
            return await _itemMasterRepository.GetItemMastersByCompanyId(companyId);
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId, string searchQuery, string itemType)
        {
            return await _itemMasterRepository.GetItemMastersByCompanyId(companyId, searchQuery, itemType);
        }

        public async Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId)
        {
            return await _itemMasterRepository.GetItemMasterByItemMasterId(itemMasterId);
        }

        public async Task UpdateItemMaster(int itemMasterId, ItemMaster itemMaster)
        {
            await _itemMasterRepository.UpdateItemMaster(itemMasterId, itemMaster);
        }

        public async Task DeleteItemMaster(int itemMasterId)
        {
            await _itemMasterRepository.DeleteItemMaster(itemMasterId);
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByUserId(int userId)
        {
            return await _itemMasterRepository.GetItemMastersByUserId(userId);
        }

        public async Task<IEnumerable<ItemMaster>> GetSubItemsByItemMasterId(int itemMaster)
        {
            return await _itemMasterRepository.GetSubItemsByItemMasterId(itemMaster);
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByItemMasterIds(int[] itemMasterIds)
        {
            return await _itemMasterRepository.GetItemMastersByItemMasterIds(itemMasterIds);
        }

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByItemTypeId(int itemtypeId)
        {
            return await _itemMasterRepository.GetItemMastersByItemTypeId(itemtypeId);
        }
    }
}
