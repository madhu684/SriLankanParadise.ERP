using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICashierExpenseOutRepository
    {
        Task AddCashierExpenseOut(CashierExpenseOut cashierExpenseOut);

        Task<IEnumerable<CashierExpenseOut>> GetCashierExpenseOutsByUserId(int userId);

        Task<IEnumerable<CashierExpenseOut>> GetCashierExpenseOutsByUserIdDate(int userId, DateTime date);
    }
}
