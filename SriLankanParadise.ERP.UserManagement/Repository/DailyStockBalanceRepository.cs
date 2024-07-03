using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class DailyStockBalanceRepository : IDailyStockBalanceRepository
    {
        private readonly ErpSystemContext _dbContext;

        public DailyStockBalanceRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddDailyStockBalance(DailyStockBalance dailyStockBalance)
        {
            try
            {
                _dbContext.DailyStockBalances.Add(dailyStockBalance);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<DailyStockBalance>> GetAll()
        {
            try
            {
                return await _dbContext.DailyStockBalances.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
