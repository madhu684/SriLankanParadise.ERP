using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ILocationInventoryMovementRepository
    {
        Task AddLocationInventoryMovement(LocationInventoryMovement locationInventoryMovement);

        Task<IEnumerable<LocationInventoryMovement>> GetAll();

        Task<LocationInventoryMovement> GetLocationInventoryMovementByLocationInventoryMovementId(int locationInventoryMovementId);

        Task UpdateLocationInventoryMovement(int locationInventoryMovementId, LocationInventoryMovement locationInventoryMovement);
    }
}
