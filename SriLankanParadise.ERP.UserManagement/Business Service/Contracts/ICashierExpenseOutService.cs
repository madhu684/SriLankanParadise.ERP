using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICashierExpenseOutService
    {
        Task AddCashierExpenseOut(CashierExpenseOut cashierExpenseOut);

        Task<IEnumerable<CashierExpenseOut>> GetCashierExpenseOutsByUserId(int userId);
        Task<IEnumerable<CashierExpenseOut>> GetCashierExpenseOutsByUserIdDate(DateTime date, int? userId = null, int? cashierSessionId=null);
    }
}
