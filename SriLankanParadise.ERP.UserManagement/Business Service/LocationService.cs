using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class LocationService : ILocationService
    { 
        private readonly ILocationRepository _locationRepository;
        public LocationService(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public async Task<IEnumerable<Location>> GetLocationsByCompanyId(int companyId)
        {
            return await _locationRepository.GetLocationsByCompanyId(companyId);
        }

        public async Task AddLocation(Location location)
        {
            await _locationRepository.AddLocation(location);
        }


        public async Task<Location> GetLocationByLocationId(int locationId)
        {
            return await _locationRepository.GetLocationByLocationId(locationId);
        }

        public async Task UpdateLocation(int locationId, Location location)
        {
            await _locationRepository.UpdateLocation(locationId, location);
        }

        public async Task<IEnumerable<Location>> GetLocationsByLocationIds(int[] locationIds)
        {
            return await _locationRepository.GetLocationsByLocationIds(locationIds);
        }
    }
}
