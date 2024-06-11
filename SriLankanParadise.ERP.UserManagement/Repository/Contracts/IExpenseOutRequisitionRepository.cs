using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IExpenseOutRequisitionRepository
    {
        Task AddExpenseOutRequisition(ExpenseOutRequisition expenseOutRequisition);

        Task<IEnumerable<ExpenseOutRequisition>> GetAll();

        Task<IEnumerable<ExpenseOutRequisition>> GetExpenseOutRequisitionsByCompanyId(int companyId);

        Task<IEnumerable<ExpenseOutRequisition>> GetExpenseOutRequisitionsByUserId(int userId);

        Task<ExpenseOutRequisition> GetExpenseOutRequisitionByExpenseOutRequisitionId(int expenseOutRequisitionId);

        Task UpdateExpenseOutRequisition(int expenseOutRequisitionId, ExpenseOutRequisition expenseOutRequisition);
    }
}
