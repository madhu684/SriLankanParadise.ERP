using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class DailyStockBalanceService : IDailyStockBalanceService
    {
        private readonly IDailyStockBalanceRepository _dailyStockBalanceRepository;
        public DailyStockBalanceService(IDailyStockBalanceRepository dailyStockBalanceRepository)
        {
            _dailyStockBalanceRepository = dailyStockBalanceRepository;
        }

        public async Task AddDailyStockBalance(DailyStockBalance dailyStockBalance)
        {
            await _dailyStockBalanceRepository.AddDailyStockBalance(dailyStockBalance);
        }

        public async Task<IEnumerable<DailyStockBalance>> GetAll()
        {
            return await _dailyStockBalanceRepository.GetAll();
        }
    }
}
