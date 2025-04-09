using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IDailyLocationInventoryRepository
    {
        Task<DailyLocationInventory> Add(DailyLocationInventory dailyLocationInventory, DateTime trasactionDate, int m);

        Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId);

        Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationTypeId, int locationId);

        Task<DailyLocationInventory> Get(DateOnly runDate, int itemMasterId, string batchNo, int locationId);

        Task<IEnumerable<DailyLocationInventory>> GetByItemId(DateOnly runDate, int itemMasterId);
    }
}
