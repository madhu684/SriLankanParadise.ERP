using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationInventoryService
    {
        Task AddLocationInventory(LocationInventory locationInventory, int movementTypeId);
        Task<IEnumerable<LocationInventory>> GetAll();
        Task<LocationInventory> GetLocationInventoryByLocationInventoryId(int locationInventoryId);
        Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationId(int locationId);
        Task<IEnumerable<LocationInventory>> GetEmptyReturnItemLocationInventoriesByLocationId(int companyId, int locationId);
        Task<IEnumerable<LocationInventory>> GetItemLocationInventoriesByLocationId(int locationId);
        Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationIdItemMasterId(int locationId, int itemMasterId);
        Task<IEnumerable<LocationInventory>> GetLocationInventoryByBatchId(int batchId);
        Task<LocationInventory> GetLocationInventoryByDetails(int locationId, int itemMasterId, int batchId);
        Task<LocationInventory> GetEmptyLocationInventoryByDetails(int locationId, int itemMasterId);
        Task UpdateLocationInventory(int locationInventoryId, LocationInventory locationInventory);
        Task UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, LocationInventory locationInventory, string operation);
        Task UpdateEmptyLocationInventoryStockInHand(int locationId, int itemMasterId, LocationInventory locationInventory, string operation);
        Task<IEnumerable<LocationInventorySummary>> GetLowStockItems(int? supplierId = null, int? locationId = null);
        // Updated Service Interface Method
        Task<LocationInventorySummary> GetSumLocationInventoriesByLocationIdItemMasterId(int? locationId, int itemMasterId);
        Task<IEnumerable<LocationInventorySummary>> GetLowStockItemsByLocationOnly(int locationId);
        Task<IEnumerable<LocationInventorySummary>> GetSumLocationInventoriesByItemName(int? locationId, string itemName, int? supplierId = null);
        Task ReduceInventoryByFIFO(int locationId, int itemMasterId, int transactionTypeId, decimal quantity);
        Task IncreaseInventoryByFIFO(int locationId, int itemMasterId, int transactionTypeId, decimal quantity, int? sourceLocationId = null);
        Task<IEnumerable<LocationInventorySummary>> GetSumOfItemInventoryByLocationId(int locationId);
        Task UpdateReorderLevelMaxStockLevel(int locationId, int itemMasterId, LocationInventory locationInventory);
        Task<LocationInventorySummary> GetSumLocationInventoriesByLocationIdItemCode(int? locationId, string itemCode);
        Task StockAdjustment(int locationInventoryId, decimal quantity);
    }
}
