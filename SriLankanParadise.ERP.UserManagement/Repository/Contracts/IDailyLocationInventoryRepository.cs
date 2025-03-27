using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IDailyLocationInventoryRepository
    {
        Task<IEnumerable<DailyLocationInventory>> Get(DateOnly runDate, int locationId);
    }
}
