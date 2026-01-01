using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ItemMasterService : IItemMasterService
    {
        private readonly IItemMasterRepository _itemMasterRepository;
        public ItemMasterService(IItemMasterRepository itemMasterRepository)
        {
            _itemMasterRepository = itemMasterRepository;
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

        public async Task<IEnumerable<ItemMaster>> GetItemMastersByCompanyWithQueryId(int companyId, string searchQuery, bool isTreatment = false)
        {
            return await _itemMasterRepository.GetItemMastersByCompanyId(companyId, searchQuery, isTreatment);
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

        public async Task<IEnumerable<SameCategoryTypeSupplierItemDto>> GetSupplierItemsByTypeAndCategory(int companyId, int itemTypeId, int categoryId, int locationId)
        {
            return await _itemMasterRepository.GetSupplierItemsByTypeAndCategory(companyId, itemTypeId, categoryId, locationId);
        }

        public async Task<IEnumerable<ItemMaster>> SearchItemByCode(string searchTerm)
        {
            return await _itemMasterRepository.SearchItemByCode(searchTerm);
        }

        public async Task<ItemMaster> GetItemMasterByItemCode(string itemCode, int companyId)
        {
            return await _itemMasterRepository.GetItemMasterByItemCode(itemCode, companyId);
        }

        public async Task<PagedResult<ItemMaster>> GetPaginatedItemMastersByCompanyId(int companyId, string? searchQuery = null, int? supplierId = null, int pageNumber = 1, int pageSize = 10)
        {
            return await _itemMasterRepository.GetPaginatedItemMastersByCompanyId(companyId, searchQuery, supplierId, pageNumber, pageSize);
        }
    }
}
