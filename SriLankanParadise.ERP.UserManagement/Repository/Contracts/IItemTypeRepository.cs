using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemTypeRepository
    {
        Task AddItemType(ItemType itemType);
        Task<IEnumerable<ItemType>> GetItemTypesByCompanyId(int companyId);
        Task<ItemType> GetItemTypeById(int itemTypeId);
        Task UpdateItemType(int itemTypeId, ItemType itemType);
    }
}
