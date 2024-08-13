using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class LocationInventoryMovementService : ILocationInventoryMovementService
    {
        private readonly ILocationInventoryMovementRepository _locationInventoryMovementRepository;
        public LocationInventoryMovementService(ILocationInventoryMovementRepository locationInventoryMovementRepository)
        {
            _locationInventoryMovementRepository = locationInventoryMovementRepository;
        }

        public async Task AddLocationInventoryMovement(LocationInventoryMovement locationInventoryMovement)
        {
            await _locationInventoryMovementRepository.AddLocationInventoryMovement(locationInventoryMovement);
        }

        public async Task<IEnumerable<LocationInventoryMovement>> GetAll()
        {
            return await _locationInventoryMovementRepository.GetAll();
        }
        
        public async Task<IEnumerable<LocationInventoryMovement>> Get(int IssueMasterId)
        {
            return await _locationInventoryMovementRepository.Get(IssueMasterId);
        }

        public async Task<IEnumerable<LocationInventoryMovement>> ByWorkOrder(int workOrderId)
        {
            return await _locationInventoryMovementRepository.ByWorkOrder(workOrderId);
        }

        public async Task<LocationInventoryMovement> GetLocationInventoryMovementByLocationInventoryMovementId(int locationInventoryMovementId)
        {
            return await _locationInventoryMovementRepository.GetLocationInventoryMovementByLocationInventoryMovementId(locationInventoryMovementId);
        }

        public async Task UpdateLocationInventoryMovement(int locationInventoryMovementId, LocationInventoryMovement locationInventoryMovement)
        {
            await _locationInventoryMovementRepository.UpdateLocationInventoryMovement(locationInventoryMovementId, locationInventoryMovement);
        }
    }
}
