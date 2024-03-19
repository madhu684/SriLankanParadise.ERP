using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class BatchRepository : IBatchRepository
    {
        private readonly ErpSystemContext _dbContext;

        public BatchRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddBatch(Batch batch)
        {
            try
            {
                _dbContext.Batches.Add(batch);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Batch>> GetAll()
        {
            try
            {
                return await _dbContext.Batches.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<Batch>> GetBatchesByCompanyId(int companyId)
        {
            try
            {
                var batches = await _dbContext.Batches
                    .Where(b => b.CompanyId == companyId)
                    .ToListAsync();

                return batches.Any() ? batches : null;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
