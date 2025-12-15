using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemMasterService
    {
        Task AddItemMaster(ItemMaster itemMaster);

        Task<IEnumerable<ItemMaster>> GetAll();

        Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId);

        Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyWithQueryId(int companyId, string searchQuery, bool isTreatment = false);

        Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId);

        Task UpdateItemMaster(int itemMasterId, ItemMaster itemMaster);

        Task DeleteItemMaster(int itemMasterId);

        Task<IEnumerable<ItemMaster>> GetItemMastersByUserId(int userId);

        Task<IEnumerable<ItemMaster>> GetSubItemsByItemMasterId(int itemMaster);

        Task<IEnumerable<ItemMaster>> GetItemMastersByItemMasterIds(int[] itemMasterIds);

        Task<IEnumerable<SameCategoryTypeSupplierItemDto>> GetSupplierItemsByTypeAndCategory(int companyId, int itemTypeId, int categoryId, int locationId);

        Task<IEnumerable<ItemMaster>> SearchItemByCode(string searchTerm);
    }
}
