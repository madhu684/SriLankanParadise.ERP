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
    }
}
