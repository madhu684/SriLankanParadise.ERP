using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class DailyLocationInventoryService : IDailyLocationInventoryService
    {
        private readonly IDailyLocationInventoryRepository _repository;

        public DailyLocationInventoryService(IDailyLocationInventoryRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId)
        {
            return await _repository.Get(runDate, locationId);
        }
    }
}
