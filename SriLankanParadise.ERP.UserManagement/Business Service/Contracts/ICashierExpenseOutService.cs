using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICashierExpenseOutService
    {
        Task AddCashierExpenseOut(CashierExpenseOut cashierExpenseOut);
    }
}
