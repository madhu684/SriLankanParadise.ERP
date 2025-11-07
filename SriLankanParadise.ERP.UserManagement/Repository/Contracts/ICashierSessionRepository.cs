using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICashierSessionRepository
    {
        Task AddCashierSession(CashierSession cashierSession);

        Task<IEnumerable<CashierSession>> GetAll();

        Task<CashierSession> GetCashierSessionByCashierSessionId(int cashierSessionId);

        Task UpdateCashierSession(int cashierSessionId, CashierSession cashierSession);

        Task<CashierSession> GetActiveSessionByUserId(int userId);
    }
}
