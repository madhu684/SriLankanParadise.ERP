using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationInventoryService
    {
        Task<LocationInventory> AddLocationInventory(LocationInventory locationInventory, int movementTypeId, int userId);

        Task<IEnumerable<LocationInventory>> GetAll();

        Task<LocationInventory> GetLocationInventoryByLocationInventoryId(int locationInventoryId);

        Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationId(int locationId);

        Task<LocationInventory> GetLocationInventoryByDetails(int locationId, int itemMasterId, int batchId);

        Task UpdateLocationInventory(int locationInventoryId, LocationInventory locationInventory);
        Task<LocationInventory> GetUniqueLocationInventory(int locationId, int itemMasterId, string batchNo);

        Task UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, LocationInventory locationInventory, string operation);
    }
}
