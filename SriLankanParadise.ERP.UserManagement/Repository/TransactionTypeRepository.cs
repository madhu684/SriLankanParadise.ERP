using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class TransactionTypeRepository : ITransactionTypeRepository
    {
        private readonly ErpSystemContext _dbContext;

        public TransactionTypeRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        

        public async Task<IEnumerable<TransactionType>> GetTransactionTypes()
        {
            try
            {
                var transactionTypes = await _dbContext.TransactionTypes
                    .ToListAsync();

                return transactionTypes.Any() ? transactionTypes : null;
            }
            catch (Exception)
            {

                throw;
            }
        }
    
    }
}
