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

        Task<IEnumerable<LocationInventory>> GetItemLocationInventoriesByLocationId(int locationId);

        Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationIdItemMasterId(int locationId, int itemMasterId);

        Task<IEnumerable<LocationInventory>> GetLocationInventoryByBatchId(int batchId);

        Task<LocationInventory> GetLocationInventoryByDetails(int locationId, int itemMasterId, int batchId);

        Task UpdateLocationInventory(int locationInventoryId, LocationInventory locationInventory);

        Task UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, LocationInventory locationInventory, string operation);
        Task<IEnumerable<LocationInventorySummary>> GetLowStockItems();

        // Updated Service Interface Method
        Task<LocationInventorySummary> GetSumLocationInventoriesByLocationIdItemMasterId(int? locationId, int itemMasterId);
    }
}
