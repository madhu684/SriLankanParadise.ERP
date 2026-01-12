using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ILocationInventoryRepository
    {
        Task AddLocationInventory(LocationInventory locationInventory, int m);
        Task<IEnumerable<LocationInventory>> GetAll();
        Task<LocationInventory> GetLocationInventoryByLocationInventoryId(int locationInventoryId);
        Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationId(int locationId);
        Task<IEnumerable<LocationInventory>> GetEmptyReturnItemLocationInventoriesByLocationId(int companyId, int locationId);
        Task<IEnumerable<LocationInventory>> GetItemLocationInventoriesByLocationId(int locationId);
        Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationIdItemMasterId(int locationId, int itemMasterId);
        Task<IEnumerable<LocationInventory>> GetLocationInventoryByBatchId(int batchId);
        Task UpdateLocationInventory(int locationInventoryId, LocationInventory locationInventory);
        Task<LocationInventory> GetLocationInventoryByDetails(int locationId, int itemMasterId, int batchId);
        Task<LocationInventory> GetEmptyLocationInventoryByDetails(int locationId, int itemMasterId);
        Task<LocationInventorySummary> GetSumLocationInventoriesByLocationIdItemMasterId(int? locationId, int itemMasterId);
        Task UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, LocationInventory locationInventory, string operation);
        Task UpdateEmptyLocationInventoryStockInHand(int locationId, int itemMasterId,LocationInventory locationInventory, string operation);
        Task<IEnumerable<LocationInventorySummary>> GetLowStockItems(int? supplierId = null, int? locationId = null);
        Task<IEnumerable<LocationInventorySummary>> GetLowStockItemsByLocationOnly(int locationId);
        Task<IEnumerable<LocationInventorySummary>> GetSumLocationInventoriesByItemName(int companyId, int? locationId, string itemName);
        Task ReduceInventoryByFIFO(int locationId, int itemMasterId, int transactionTypeId, decimal quantity);
        Task IncreaseInventoryByFIFO(int locationId, int itemMasterId, int transactionTypeId, decimal quantity, int? sourceLocationId = null);
        Task<IEnumerable<LocationInventorySummary>> GetSumOfItemInventoryByLocationId(int locationId);
        Task UpdateReorderLevelMaxStockLevel(int locationId, int itemMasterId, LocationInventory locationInventory);
        Task<LocationInventorySummary> GetSumLocationInventoriesByLocationIdItemCode(int? locationId, string itemCode);
    }

}
