using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CashierExpenseOutService : ICashierExpenseOutService
    {
        private readonly ICashierExpenseOutRepository _cashierExpenseOutRepository;
        public CashierExpenseOutService(ICashierExpenseOutRepository cashierExpenseOutRepository)
        {
            _cashierExpenseOutRepository = cashierExpenseOutRepository;
        }

        public async Task AddCashierExpenseOut(CashierExpenseOut cashierExpenseOut)
        {
            await _cashierExpenseOutRepository.AddCashierExpenseOut(cashierExpenseOut);
        }
    }
}
