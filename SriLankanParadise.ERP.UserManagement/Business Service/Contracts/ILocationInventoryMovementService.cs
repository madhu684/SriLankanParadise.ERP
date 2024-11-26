using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationInventoryMovementService
    {
        Task AddLocationInventoryMovement(LocationInventoryMovement locationInventoryMovement);
        Task<IEnumerable<LocationInventoryMovement>> GetAll();
        Task<IEnumerable<LocationInventoryMovement>> Get(int IssueMasterId);
        Task<IEnumerable<LocationInventoryMovement>> Get(int itemMasterId, int referenceNo, int movementTypeId);
        Task<IEnumerable<LocationInventoryMovement>> ByWorkOrder(int workOrderId);
        Task<IEnumerable<LocationInventoryMovement>> ByDateRange(DateTime fromDate, DateTime toDate);
        Task<IEnumerable<LocationInventoryMovementExtended>> ByDateRange(DateTime fromDate, DateTime toDate, int movementTypeId);
        Task<IEnumerable<LocationInventoryMovement>> GetOnOrBeforeSpecificDate(DateTime date, int movementTypeId, int transactionTypeId);
        Task<IEnumerable<LocationInventoryMovementExtended>> ByDateRange(DateTime fromDate, DateTime toDate, int locationId, int movementTypeId);
        Task<IEnumerable<LocationInventoryMovement>> ByDateRangeAndTransactionType(DateTime fromDate, DateTime toDate, int movementTypeId, int transactionTypeId);
        Task<IEnumerable<LocationInventoryMovement>> GetWithoutBatchNo(int movementTypeId, int transactionTypeId, int itemMasterId, int locationId, int referenceId);
        Task<LocationInventoryMovement> GetLocationInventoryMovementByLocationInventoryMovementId(int locationInventoryMovementId);
        Task UpdateLocationInventoryMovement(int locationInventoryMovementId, LocationInventoryMovement locationInventoryMovement);
        Task<IEnumerable<LocationInventoryMovement>> GetUnique(int movementTypeId, int transactionTypeId, int itemMasterId, string batchNo, int locationId, int referenceId);
        Task<IEnumerable<LocationInventoryMovement>> GetWithoutReferenceNo(int movementTypeId, int transactionTypeId, int itemMasterId, string batchNo, int locationId, DateTime fromDate, DateTime toDate);
    }
}
