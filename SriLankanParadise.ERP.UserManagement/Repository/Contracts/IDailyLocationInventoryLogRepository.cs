using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IDailyLocationInventoryLogRepository
    {
        Task Add(DailyLocationInventoryLog dailyLocationInventoryLog);
    }
}
