using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IDailyLocationInventoryService
    {
        Task<DailyLocationInventory> Get(DateTime runDate, int locationId);
    }
}
