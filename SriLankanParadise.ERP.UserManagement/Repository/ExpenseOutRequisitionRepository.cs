using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ExpenseOutRequisitionRepository : IExpenseOutRequisitionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ExpenseOutRequisitionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddExpenseOutRequisition(ExpenseOutRequisition expenseOutRequisition)
        {
            try
            {
                _dbContext.ExpenseOutRequisitions.Add(expenseOutRequisition);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ExpenseOutRequisition>> GetAll()
        {
            try
            {
                return await _dbContext.ExpenseOutRequisitions
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ExpenseOutRequisition>> GetExpenseOutRequisitionsByCompanyId(int companyId)
        {
            try
            {
                var expenseOutRequisitions = await _dbContext.ExpenseOutRequisitions
                    .Where(eor => eor.CompanyId == companyId)
                    .Include(eor => eor.CashierExpenseOuts)
                    .ToListAsync();

                return expenseOutRequisitions.Any() ? expenseOutRequisitions : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ExpenseOutRequisition>> GetExpenseOutRequisitionsByUserId(int userId)
        {
            try
            {
                var expenseOutRequisitions = await _dbContext.ExpenseOutRequisitions
                    .Where(sr => sr.RequestedUserId == userId)
                    .Include(eor => eor.CashierExpenseOuts)
                    .ToListAsync();


                return expenseOutRequisitions.Any() ? expenseOutRequisitions : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ExpenseOutRequisition> GetExpenseOutRequisitionByExpenseOutRequisitionId(int expenseOutRequisitionId)
        {
            try
            {
                var salesReceipt = await _dbContext.ExpenseOutRequisitions
                    .Where(sr => sr.ExpenseOutRequisitionId == expenseOutRequisitionId)
                    .FirstOrDefaultAsync();

                return salesReceipt;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateExpenseOutRequisition(int expenseOutRequisitionId, ExpenseOutRequisition expenseOutRequisition)
        {
            try
            {
                var existsExpenseOutRequisition = await _dbContext.ExpenseOutRequisitions.FindAsync(expenseOutRequisitionId);

                if (existsExpenseOutRequisition != null)
                {
                    _dbContext.Entry(existsExpenseOutRequisition).CurrentValues.SetValues(expenseOutRequisition);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

