using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class DailyLocationInventoryService : IDailyLocationInventoryService
    {
        private readonly IDailyLocationInventoryRepository dailyLocationInventoryRepository;

        public DailyLocationInventoryService(IDailyLocationInventoryRepository dailyLocationInventoryRepository)
        {
            this.dailyLocationInventoryRepository = dailyLocationInventoryRepository;
        }

        public async Task<DailyLocationInventory> Get(DateTime runDate, int locationId)
        {
            return await dailyLocationInventoryRepository.Get(runDate, locationId);
        }
    }
}
