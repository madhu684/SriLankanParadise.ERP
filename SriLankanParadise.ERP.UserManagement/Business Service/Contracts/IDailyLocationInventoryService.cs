using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IDailyLocationInventoryService
    {
        Task Add(DailyLocationInventory dailyLocationInventory);

        Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId);

        Task<DailyLocationInventory> Get(DateOnly runDate, int itemMasterId, string batchNo, int locationId);
    }
}
