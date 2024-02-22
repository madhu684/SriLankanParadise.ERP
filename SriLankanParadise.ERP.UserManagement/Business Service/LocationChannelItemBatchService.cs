using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class LocationChannelItemBatchService : ILocationChannelItemBatchService
    {
        private readonly ILocationChannelItemBatchRepository _locationChannelItemBatchRepository;
        public LocationChannelItemBatchService(ILocationChannelItemBatchRepository locationChannelItemBatchRepository)
        {
            _locationChannelItemBatchRepository = locationChannelItemBatchRepository;
        }

        public async Task AddLocationChannelItemBatch(LocationChannelItemBatch locationChannelItemBatch)
        {
            await _locationChannelItemBatchRepository.AddLocationChannelItemBatch(locationChannelItemBatch);
        }
    }
}
