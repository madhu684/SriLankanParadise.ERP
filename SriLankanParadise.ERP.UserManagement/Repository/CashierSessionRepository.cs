using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CashierSessionRepository : ICashierSessionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CashierSessionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddCashierSession(CashierSession cashierSession)
        {
            try
            {
                _dbContext.CashierSessions.Add(cashierSession);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<CashierSession> GetActiveSessionByUserId(int userId)
        {
            try
            {
                var cashierSession = await _dbContext.CashierSessions
                    .Where(cs => cs.UserId == userId && cs.IsActiveSession)
                    .FirstOrDefaultAsync();

                return cashierSession;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<CashierSession>> GetAll()
        {
            try
            {
                return await _dbContext.CashierSessions
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<CashierSession> GetCashierSessionByCashierSessionId(int cashierSessionId)
        {
            try
            {
                var cashierSession = await _dbContext.CashierSessions
                    .Where(cs => cs.CashierSessionId == cashierSessionId)
                    .FirstOrDefaultAsync();

                return cashierSession;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateCashierSession(int cashierSessionId, CashierSession cashierSession)
        {
            try
            {
                var existCashierSession = await _dbContext.CashierSessions.FindAsync(cashierSessionId);

                if (existCashierSession != null)
                {
                    _dbContext.Entry(existCashierSession).CurrentValues.SetValues(cashierSession);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<CashierSession>> GetCashierSessionsByUserIdAndDate(int userId, DateTime date)
        {
            try
            {
                return await _dbContext.CashierSessions
                    .Where(cs => cs.UserId == userId && cs.SessionIn.Value.Date == date.Date)
                    .ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
