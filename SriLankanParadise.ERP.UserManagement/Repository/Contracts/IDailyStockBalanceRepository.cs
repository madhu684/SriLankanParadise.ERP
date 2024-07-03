using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IDailyStockBalanceRepository
    {
        Task AddDailyStockBalance(DailyStockBalance dailyStockBalance);

        Task<IEnumerable<DailyStockBalance>> GetAll();
    }
}
