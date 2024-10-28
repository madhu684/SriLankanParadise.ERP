using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IDailyLocationInventoryRepository
    {
        Task<DailyLocationInventory> Get(DateTime runDate, int locationId);
    }
}
