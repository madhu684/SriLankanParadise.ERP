using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IDailyLocationInventoryRepository
    {
        Task Add(DailyLocationInventory dailyLocationInventory);

        Task<DailyLocationInventory> Get(DateTime runDate, int locationId);
    }
}
