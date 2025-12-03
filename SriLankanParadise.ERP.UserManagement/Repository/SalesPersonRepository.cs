using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SalesPersonRepository : ISalesPersonRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SalesPersonRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        // **************************************************
        // Add a new SalesPerson
        // **************************************************
        public async Task AddSalesPerson(SalesPerson salesPerson)
        {
            try
            {
                _dbContext.SalesPersons.Add(salesPerson);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        // **************************************************
        // Get all SalesPersons
        // **************************************************
        public async Task<IEnumerable<SalesPerson>> GetAll()
        {
            try
            {
                return await _dbContext.SalesPersons
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        // **************************************************
        // Get SalesPerson by Id
        // **************************************************
        public async Task<SalesPerson?> GetById(int id)
        {
            try
            {
                var salesPerson = await _dbContext.SalesPersons
                    .AsNoTracking()
                    .FirstOrDefaultAsync(sp => sp.SalesPersonId == id);

                return salesPerson;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // **************************************************
        // Update SalesPerson (PUT)
        // **************************************************
        public async Task Update(int salesPersonId, SalesPerson salesPerson)
        {
            try
            {
                var existing = await _dbContext.SalesPersons.FindAsync(salesPersonId);
                if (existing != null)
                {
                    _dbContext.Entry(existing).CurrentValues.SetValues(salesPerson);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        // **************************************************
        // Delete SalesPerson (soft or hard)
        // **************************************************
        public async Task Delete(int salesPersonId)
        {
            try
            {
                var existing = await _dbContext.SalesPersons.FindAsync(salesPersonId);
                if (existing != null)
                {
                    _dbContext.SalesPersons.Remove(existing); // Hard delete
                    // For soft delete, use: existing.IsActive = false;
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        // **************************************************
        // Toggle Active/Inactive
        // **************************************************
        public async Task ActiveDeactiveSalesPerson(int salesPersonId, bool isActive)
        {
            try
            {
                var existing = await _dbContext.SalesPersons.FindAsync(salesPersonId);
                if (existing != null)
                {
                    existing.IsActive = isActive;
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
