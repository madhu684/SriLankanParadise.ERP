﻿using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
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

        public async Task AddLocationInventory(LocationInventory locationInventory)
        {
            await _locationInventoryRepository.AddLocationInventory(locationInventory);
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

        public async Task<LocationInventory> GetLocationInventoryByDetails(int locationId, int itemMasterId, int batchId)
        {
            return await _locationInventoryRepository.GetLocationInventoryByDetails(locationId, itemMasterId, batchId);
        }

        public async Task UpdateLocationInventory(int locationInventoryId, LocationInventory locationInventory)
        {
            await _locationInventoryRepository.UpdateLocationInventory(locationInventoryId, locationInventory);
        }

        public async Task UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, LocationInventory locationInventory, string operation )
        {
            await _locationInventoryRepository.UpdateLocationInventoryStockInHand(locationId, itemMasterId, batchId, locationInventory, operation);
        }
    }
}