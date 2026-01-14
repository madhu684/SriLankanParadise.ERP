using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CashierExpenseOutRepository : ICashierExpenseOutRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CashierExpenseOutRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddCashierExpenseOut(CashierExpenseOut cashierExpenseOut)
        {
            try
            {
                _dbContext.CashierExpenseOuts.Add(cashierExpenseOut);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<CashierExpenseOut>> GetCashierExpenseOutsByUserId(int userId)
        {
            try
            {
                var cashierExpenseOuts = await _dbContext.CashierExpenseOuts
                    .Where(eo => eo.UserId == userId)
                    .ToListAsync();

                return cashierExpenseOuts.Any() ? cashierExpenseOuts : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<CashierExpenseOut>> GetCashierExpenseOutsByUserIdDate(int userId, DateTime date, int? cashierSessionId = null)
        {
            try
            {
                var query = _dbContext.CashierExpenseOuts
                    .Where(eo => eo.UserId == userId && eo.CreatedDate.HasValue && eo.CreatedDate.Value.Date == date.Date);

                if (cashierSessionId.HasValue)
                {
                    query = query.Where(eo => eo.CashierSessionId == cashierSessionId.Value);
                }

                var cashierExpenseOuts = await query.ToListAsync();

                return cashierExpenseOuts.Any() ? cashierExpenseOuts : null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
