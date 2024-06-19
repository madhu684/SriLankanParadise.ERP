using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class LocationInventoryGoodsInTransitService : ILocationInventoryGoodsInTransitService
    {
        private readonly ILocationInventoryGoodsInTransitRepository _locationInventoryGoodsInTransitRepository;
        public LocationInventoryGoodsInTransitService(ILocationInventoryGoodsInTransitRepository locationInventoryGoodsInTransitRepository)
        {
            _locationInventoryGoodsInTransitRepository = locationInventoryGoodsInTransitRepository;
        }

        public async Task AddLocationInventoryGoodsInTransit(LocationInventoryGoodsInTransit locationInventoryGoodsInTransit)
        {
            await _locationInventoryGoodsInTransitRepository.AddLocationInventoryGoodsInTransit(locationInventoryGoodsInTransit);
        }

        public async Task<IEnumerable<LocationInventoryGoodsInTransit>> GetAll()
        {
            return await _locationInventoryGoodsInTransitRepository.GetAll();
        }

        public async Task<LocationInventoryGoodsInTransit> GetLocationInventoryGoodsInTransitByLocationInventoryGoodsInTransitId(int locationInventoryGoodsInTransitId)
        {
            return await _locationInventoryGoodsInTransitRepository.GetLocationInventoryGoodsInTransitByLocationInventoryGoodsInTransitId(locationInventoryGoodsInTransitId);
        }

        public async Task<LocationInventoryGoodsInTransit> GetLocationInventoryGoodsInTransitByDetails(int toLocationId, int fromLocationId, int itemMasterId, int batchId)
        {
            return await _locationInventoryGoodsInTransitRepository.GetLocationInventoryGoodsInTransitByDetails(toLocationId, fromLocationId, itemMasterId, batchId);
        }

        public async Task UpdateLocationInventoryGoodsInTransit(int locationInventoryGoodsInTransitId, LocationInventoryGoodsInTransit locationInventoryGoodsInTransit)
        {
            await _locationInventoryGoodsInTransitRepository.UpdateLocationInventoryGoodsInTransit(locationInventoryGoodsInTransitId, locationInventoryGoodsInTransit);
        }

        public async Task UpdateLocationInventoryGoodsInTransitStatus(int toLocationId, int fromLocationId, int itemMasterId, int batchId, LocationInventoryGoodsInTransit locationInventoryGoodsInTransit)
        {
            await _locationInventoryGoodsInTransitRepository.UpdateLocationInventoryGoodsInTransitStatus(toLocationId, fromLocationId, itemMasterId, batchId, locationInventoryGoodsInTransit);
        }
    }
}
