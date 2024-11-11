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

        public async Task Add(DailyLocationInventory dailyLocationInventory)
        {
            await dailyLocationInventoryRepository.Add(dailyLocationInventory);
        }

        public async Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId)
        {
            return await dailyLocationInventoryRepository.Get(runDate, locationId);
        }

        public async Task<DailyLocationInventory> Get(DateOnly runDate, int itemMasterId, string batchNo, int locationId)
        {
            return await dailyLocationInventoryRepository.Get(runDate, itemMasterId, batchNo, locationId);
        }

        public async Task<IEnumerable<DailyLocationInventory>> GetByItemId(DateOnly runDate, int itemMasterId)
        {
            return await dailyLocationInventoryRepository.GetByItemId(runDate, itemMasterId);
        }
    }
}
