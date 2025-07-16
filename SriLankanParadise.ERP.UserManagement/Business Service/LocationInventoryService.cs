using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class LocationInventoryService : ILocationInventoryService
    {
        private readonly ILocationInventoryRepository _locationInventoryRepository;
        public LocationInventoryService(ILocationInventoryRepository locationInventoryRepository)
        {
            _locationInventoryRepository = locationInventoryRepository;
        }

        public async Task AddLocationInventory(LocationInventory locationInventory, int m)
        {
            await _locationInventoryRepository.AddLocationInventory(locationInventory, m);
        }

        public async Task<IEnumerable<LocationInventory>> GetAll()
        {
            return await _locationInventoryRepository.GetAll();
        }

        public async Task<LocationInventory> GetLocationInventoryByLocationInventoryId(int locationInventoryId)
        {
            return await _locationInventoryRepository.GetLocationInventoryByLocationInventoryId(locationInventoryId);
        }

        public async Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationId(int locationId)
        {
            return await _locationInventoryRepository.GetLocationInventoriesByLocationId(locationId);
        }
        public async Task<IEnumerable<LocationInventory>> GetEmptyReturnItemLocationInventoriesByLocationId(int locationId)
        {
            return await _locationInventoryRepository.GetEmptyReturnItemLocationInventoriesByLocationId(locationId);
        }

        public async Task<IEnumerable<LocationInventory>> GetLocationInventoriesByLocationIdItemMasterId(int locationId, int itemMasrerId)
        {
            return await _locationInventoryRepository.GetLocationInventoriesByLocationIdItemMasterId(locationId, itemMasrerId);
        }

        public async Task<LocationInventory> GetLocationInventoryByDetails(int locationId, int itemMasterId, int batchId)
        {
            return await _locationInventoryRepository.GetLocationInventoryByDetails(locationId, itemMasterId, batchId);
        }
        public async Task<LocationInventory> GetEmptyLocationInventoryByDetails(int locationId, int itemMasterId)
        {
            return await _locationInventoryRepository.GetEmptyLocationInventoryByDetails(locationId, itemMasterId);
        }

        public async Task UpdateLocationInventory(int locationInventoryId, LocationInventory locationInventory)
        {
            await _locationInventoryRepository.UpdateLocationInventory(locationInventoryId, locationInventory);
        }
        public async Task UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, LocationInventory locationInventory, string operation)
        {
            await _locationInventoryRepository.UpdateLocationInventoryStockInHand(locationId, itemMasterId, batchId, locationInventory, operation);
        }
        public async Task UpdateEmptyLocationInventoryStockInHand(int locationId, int itemMasterId,LocationInventory locationInventory, string operation)
        {
            await _locationInventoryRepository.UpdateEmptyLocationInventoryStockInHand(locationId, itemMasterId,locationInventory, operation);
        }

        public async Task<IEnumerable<LocationInventory>> GetItemLocationInventoriesByLocationId(int locationId)
        {
            return await _locationInventoryRepository.GetItemLocationInventoriesByLocationId(locationId);
        }

        public async Task<IEnumerable<LocationInventory>> GetLocationInventoryByBatchId(int batchId)
        {
            return await _locationInventoryRepository.GetLocationInventoryByBatchId(batchId);
        }
        public async Task<LocationInventorySummary> GetSumLocationInventoriesByLocationIdItemMasterId(int locationId, int itemMasterId)
        {
            return await _locationInventoryRepository.GetSumLocationInventoriesByLocationIdItemMasterId(locationId, itemMasterId);
        }

        public async Task<IEnumerable<LocationInventorySummary>> GetLowStockItems()
        {
            return await _locationInventoryRepository.GetLowStockItems();
        }
    }
}
