using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
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

        public async Task<IEnumerable<ExpenseOutRequisition>> GetApprovedExpenseOutRequisitions(int status, int companyId, string? SearchQuery)
        {
            try
            {
                var query = _dbContext.ExpenseOutRequisitions
                    .AsNoTracking()
                    .Include(eor => eor.CashierExpenseOuts)
                    .Where(sr => sr.Status == status && sr.CompanyId == companyId);
              

                //Apply Filter
                if (!string.IsNullOrEmpty(SearchQuery))
                {
                    var searchTerm = SearchQuery.ToLower().Trim();
                    query = query.Where(sr => 
                    sr.ReferenceNumber.ToLower().Contains(searchTerm));    
                }

                var expenseOutRequisitions = await query.ToListAsync();

                return expenseOutRequisitions.Any() ? expenseOutRequisitions : null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<PagedResult<ExpenseOutRequisition>> GetExpenseOutRequisitionsWithPagination(int companyId, int pageNumber, int pageSize, DateTime? filterDate)
        {
            try
            {
                var query = _dbContext.ExpenseOutRequisitions
                    .AsNoTracking()
                    .Include(eor => eor.CashierExpenseOuts)
                    .Where(eor => eor.CompanyId == companyId);

                if (filterDate.HasValue)
                {
                    // Filter: All items that are NOT (Status 4 AND Date != FilterDate)
                    // Requirements:
                    // 1. Show ALL "Not Expensed Out" (Status != 4)
                    // 2. Show "Expensed Out" (Status == 4) ONLY if Date == FilterDate
                    // Combined: (Status != 4) OR (Date == FilterDate)
                    // Note: If Status == 4 and Date != FilterDate, it should be excluded.
                    
                    var date = filterDate.Value.Date;
                    query = query.Where(eor => eor.Status != 4 || (eor.CreatedDate.HasValue && eor.CreatedDate.Value.Date == date));
                }

                // Sorting: Not Expensed Out (Status != 4) first, then by Date Descending
                query = query.OrderBy(eor => eor.Status == 4 ? 1 : 0)
                             .ThenByDescending(eor => eor.CreatedDate);

                var totalCount = await query.CountAsync();

                var items = await query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<ExpenseOutRequisition>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

