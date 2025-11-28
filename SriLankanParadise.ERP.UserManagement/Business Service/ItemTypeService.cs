using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemTypeService : IItemTypeService
    {
        private readonly IItemTypeRepository _itemTypeRepository;
        public ItemTypeService(IItemTypeRepository itemTypeRepository)
        {
            _itemTypeRepository = itemTypeRepository;
        }

        public async Task AddItemType(ItemType itemType)
        {
            await _itemTypeRepository.AddItemType(itemType);
        }

        public async Task<ItemType> GetItemTypeById(int itemTypeId)
        {
            return await _itemTypeRepository.GetItemTypeById(itemTypeId);
        }

        public async Task<IEnumerable<ItemType>> GetItemTypesByCompanyId(int companyId)
        {
            return await _itemTypeRepository.GetItemTypesByCompanyId(companyId);
        }

        public async Task UpdateItemType(int itemTypeId, ItemType itemType)
        {
            await _itemTypeRepository.UpdateItemType(itemTypeId, itemType);
        }
    }
}
