using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IDailyLocationInventoryService
    {
        Task Add(DailyLocationInventory dailyLocationInventory);

        Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId);
    }
}
