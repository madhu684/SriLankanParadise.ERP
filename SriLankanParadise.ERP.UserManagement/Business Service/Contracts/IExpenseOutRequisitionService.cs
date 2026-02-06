using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IExpenseOutRequisitionService
    {
        Task AddExpenseOutRequisition(ExpenseOutRequisition expenseOutRequisition);

        Task<IEnumerable<ExpenseOutRequisition>> GetAll();

        Task<IEnumerable<ExpenseOutRequisition>> GetExpenseOutRequisitionsByCompanyId(int companyId);

        Task<IEnumerable<ExpenseOutRequisition>> GetExpenseOutRequisitionsByUserId(int userId);

        Task<ExpenseOutRequisition> GetExpenseOutRequisitionByExpenseOutRequisitionId(int expenseOutRequisitionId);

        Task UpdateExpenseOutRequisition(int expenseOutRequisitionId, ExpenseOutRequisition expenseOutRequisition);

        Task<IEnumerable<ExpenseOutRequisition>> GetApprovedExpenseOutRequisitions(int status,int companyId, string? searchQuery);

        Task<PagedResult<ExpenseOutRequisition>> GetExpenseOutRequisitionsWithPagination(int companyId, int pageNumber, int pageSize, DateTime? filterDate);
    }
}
