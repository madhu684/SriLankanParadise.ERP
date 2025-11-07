using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICashierSessionService
    {
        Task AddCashierSession(CashierSession cashierSession);

        Task<IEnumerable<CashierSession>> GetAll();

        Task<CashierSession> GetCashierSessionByCashierSessionId(int cashierSessionId);

        Task UpdateCashierSession(int cashierSessionId, CashierSession cashierSession);

        Task<CashierSession> GetActiveSessionByUserId(int userId);
    }
}
