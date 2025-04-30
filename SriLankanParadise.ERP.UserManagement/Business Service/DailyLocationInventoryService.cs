using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class DailyLocationInventoryService : IDailyLocationInventoryService
    {
        private readonly IDailyLocationInventoryRepository dailyLocationInventoryRepository;
        private readonly IDailyLocationInventoryLogRepository dailyLocationInventoryLogRepository;

        public DailyLocationInventoryService(IDailyLocationInventoryRepository dailyLocationInventoryRepository, IDailyLocationInventoryLogRepository dailyLocationInventoryLogRepository)
        {
            this.dailyLocationInventoryRepository = dailyLocationInventoryRepository;
            this.dailyLocationInventoryLogRepository = dailyLocationInventoryLogRepository;
        }

        public async Task<DailyLocationInventory> Add(DailyLocationInventory dailyLocationInventory, DateTime trasactionDate, int m, int EnteredUserId, string? Remark)
        {
            try
            {
                var resultEntry = await dailyLocationInventoryRepository.Add(dailyLocationInventory, trasactionDate, m);

                if (resultEntry != null) 
                {
                    var dailyInventorylog = new DailyLocationInventoryLog
                    {
                        DailyLocationInventoryId = resultEntry.Id,
                        EnteredDate = DateTime.UtcNow,
                        EnteredUserId = EnteredUserId,
                        Qty = dailyLocationInventory.StockInHand,
                        Remark = Remark
                    };
                    await dailyLocationInventoryLogRepository.Add(dailyInventorylog);
                }

                return resultEntry;
            }
            catch (Exception) 
            {
                throw;
            }
        }

        public async Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId)
        {
            return await dailyLocationInventoryRepository.Get(runDate, locationId);
        }

        public async Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationTypeId, int locationId)
        {
            return await dailyLocationInventoryRepository.Get(runDate, locationTypeId, locationId);
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
