using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationInventoryMovementService
    {
        Task AddLocationInventoryMovement(LocationInventoryMovement locationInventoryMovement);

        Task<IEnumerable<LocationInventoryMovement>> GetAll();
        Task<IEnumerable<LocationInventoryMovement>> Get(int IssueMasterId);
        Task<IEnumerable<LocationInventoryMovement>> ByWorkOrder(int workOrderId);
        Task<IEnumerable<LocationInventoryMovement>> ByDateRange(DateTime fromDate, DateTime toDate);

        Task<LocationInventoryMovement> GetLocationInventoryMovementByLocationInventoryMovementId(int locationInventoryMovementId);

        Task UpdateLocationInventoryMovement(int locationInventoryMovementId, LocationInventoryMovement locationInventoryMovement);
    }
}
