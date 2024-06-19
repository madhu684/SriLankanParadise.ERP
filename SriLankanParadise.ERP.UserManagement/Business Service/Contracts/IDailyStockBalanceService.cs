using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IDailyStockBalanceService
    {
        Task AddDailyStockBalance(DailyStockBalance dailyStockBalance);

        Task<IEnumerable<DailyStockBalance>> GetAll();
    }
}
