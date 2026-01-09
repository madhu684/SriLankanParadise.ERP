using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class LocationTypeService : ILocationTypeService
    {
        private readonly ILocationTypeRepository _locationTypeRepository;
        public LocationTypeService(ILocationTypeRepository locationTypeRepository)
        {
            _locationTypeRepository = locationTypeRepository;
        }

        public async Task<IEnumerable<LocationType>> GetLocationTypesByCompanyId()
        {
            return await _locationTypeRepository.GetLocationTypesByCompanyId();
        }
    }
}
