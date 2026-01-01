using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Threading.Tasks;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IItemMasterRepository
    {
        Task AddItemMaster(ItemMaster itemMaster);

        Task<IEnumerable<ItemMaster>> GetAll();

        Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId);

        //Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId, string searchQuery, string itemType);
        Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyId(int companyId, string searchQuery, bool isTreatment = false);

        Task<ItemMaster> GetItemMasterByItemMasterId(int itemMasterId);

        Task UpdateItemMaster(int itemMasterId, ItemMaster itemMaster);

        Task DeleteItemMaster(int itemMasterId);

        Task<IEnumerable<ItemMaster>> GetItemMastersByUserId(int userId);

        Task<IEnumerable<ItemMaster>> GetSubItemsByItemMasterId(int itemMaster);

        Task<IEnumerable<ItemMaster>> GetItemMastersByItemMasterIds(int[] itemMasterIds);

        Task<IEnumerable<SameCategoryTypeSupplierItemDto>> GetSupplierItemsByTypeAndCategory(int companyId, int itemTypeId, int categoryId, int locationId);

        Task<IEnumerable<ItemMaster>> SearchItemByCode(string searchTerm);

        Task<ItemMaster> GetItemMasterByItemCode(string itemCode, int companyId);

        Task<PagedResult<ItemMaster>> GetPaginatedItemMastersByCompanyId(int companyId, string? searchQuery = null, int? supplierId = null, int pageNumber = 1, int pageSize = 10);
    }
}
