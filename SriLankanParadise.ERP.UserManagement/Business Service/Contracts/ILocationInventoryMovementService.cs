﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationInventoryMovementService
    {
        Task AddLocationInventoryMovement(LocationInventoryMovement locationInventoryMovement);

        Task<IEnumerable<LocationInventoryMovement>> GetAll();

        Task<LocationInventoryMovement> GetLocationInventoryMovementByLocationInventoryMovementId(int locationInventoryMovementId);

        Task UpdateLocationInventoryMovement(int locationInventoryMovementId, LocationInventoryMovement locationInventoryMovement);
    }
}