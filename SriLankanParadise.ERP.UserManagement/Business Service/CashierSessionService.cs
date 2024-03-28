using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CashierSessionService : ICashierSessionService
    {
        private readonly ICashierSessionRepository _cashierSessionRepository;
        public CashierSessionService(ICashierSessionRepository cashierSessionRepository)
        {
            _cashierSessionRepository = cashierSessionRepository;
        }

        public async Task AddCashierSession(CashierSession cashierSession)
        {
            await _cashierSessionRepository.AddCashierSession(cashierSession);
        }

        public async Task<IEnumerable<CashierSession>> GetAll()
        {
            return await _cashierSessionRepository.GetAll();
        }

        public async Task<CashierSession> GetCashierSessionByCashierSessionId(int cashierSessionId)
        {
            return await _cashierSessionRepository.GetCashierSessionByCashierSessionId(cashierSessionId);
        }

        public async Task UpdateCashierSession(int cashierSessionId, CashierSession cashierSession)
        {
            await _cashierSessionRepository.UpdateCashierSession(cashierSessionId, cashierSession);
        }
    }
}
