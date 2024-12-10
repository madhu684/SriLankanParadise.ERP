using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ILocationInventoryRepository
    {
        Task AddLocationInventory(LocationInventory locationInventory, int m);

        Task<IEnumerable<LocationInventory>> GetAll();

        Task<LocationInventory> GetLocationInventoryByLocationInventoryId(int locationInventoryId);

        Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationId(int locationId);

        Task UpdateLocationInventory(int locationInventoryId, LocationInventory locationInventory);

        Task<LocationInventory> GetLocationInventoryByDetails(int locationId, int itemMasterId, int batchId);
        Task<LocationInventory> GetUniqueLocationInventory(int locationId, int itemMasterId, string batchNo);

        Task UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, LocationInventory locationInventory, string operation);
    }

}
