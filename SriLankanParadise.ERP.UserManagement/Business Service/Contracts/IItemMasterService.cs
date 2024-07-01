using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemMasterService
    {
        Task AddItemMaster(ItemMaster itemMaster);

        Task<IEnumerable<ItemMaster>> GetAll();

        Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId);

        Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId, string searchQuery, string itemType);

        Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId);

        Task UpdateItemMaster(int itemMasterId, ItemMaster itemMaster);

        Task DeleteItemMaster(int itemMasterId);

        Task<IEnumerable<ItemMaster>> GetItemMastersByUserId(int userId);

        Task<IEnumerable<ItemMaster>> GetSubItemsByItemMasterId(int itemMaster);

        Task<IEnumerable<ItemMaster>> GetItemMastersByItemMasterIds(int[] itemMasterIds);

    }
}
