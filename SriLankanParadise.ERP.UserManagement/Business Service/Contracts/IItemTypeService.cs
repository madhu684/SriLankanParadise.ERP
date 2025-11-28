using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemTypeService
    {
        Task AddItemType(ItemType itemType);
        Task<IEnumerable<ItemType>> GetItemTypesByCompanyId(int companyId);
        Task<ItemType> GetItemTypeById(int itemTypeId);
        Task UpdateItemType(int itemTypeId, ItemType itemType);
    }
}
