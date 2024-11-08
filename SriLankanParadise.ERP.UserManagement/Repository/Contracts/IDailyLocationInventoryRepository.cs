using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IDailyLocationInventoryRepository
    {
        Task Add(DailyLocationInventory dailyLocationInventory);

        Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId);

        Task<DailyLocationInventory> Get(DateOnly runDate, int itemMasterId, string batchNo, int locationId);
    }
}
