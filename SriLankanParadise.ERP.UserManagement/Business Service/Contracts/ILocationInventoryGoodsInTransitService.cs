﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationInventoryGoodsInTransitService
    {
        Task AddLocationInventoryGoodsInTransit(LocationInventoryGoodsInTransit locationInventoryGoodsInTransit);

        Task<IEnumerable<LocationInventoryGoodsInTransit>> GetAll();

        Task<LocationInventoryGoodsInTransit> GetLocationInventoryGoodsInTransitByLocationInventoryGoodsInTransitId(int locationInventoryGoodsInTransitId);

        Task UpdateLocationInventoryGoodsInTransit(int locationInventoryGoodsInTransitId, LocationInventoryGoodsInTransit locationInventoryGoodsInTransit);

        Task<LocationInventoryGoodsInTransit> GetLocationInventoryGoodsInTransitByDetails(int toLocationId, int fromLocationId, int itemMasterId, int batchId);

        Task UpdateLocationInventoryGoodsInTransitStatus(int toLocationId, int fromLocationId, int itemMasterId, int batchId, LocationInventoryGoodsInTransit locationInventoryGoodsInTransit);
    }
}