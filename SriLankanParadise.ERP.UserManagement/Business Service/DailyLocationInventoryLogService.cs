using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class DailyLocationInventoryLogService : IDailyLocationInventoryLogService
    {
        private readonly IDailyLocationInventoryLogRepository _dailyLocationInventoryLogRepository;

        public DailyLocationInventoryLogService(IDailyLocationInventoryLogRepository dailyLocationInventoryLogRepository)
        {
            _dailyLocationInventoryLogRepository = dailyLocationInventoryLogRepository;
        }
        public async Task Add(DailyLocationInventoryLog dailyLocationInventoryLog)
        {
            await _dailyLocationInventoryLogRepository.Add(dailyLocationInventoryLog);
        }
    }
}
