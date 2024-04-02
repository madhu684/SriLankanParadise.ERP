using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SupplierRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId)
        {
            try
            {
                var suppliers = await _dbContext.Suppliers
                    .Where(s => s.CompanyId == companyId)
                    .ToListAsync();

                if (suppliers.Any())
                {
                    return suppliers;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task AddSupplier(Supplier supplier)
        {
            try
            {
                _dbContext.Suppliers.Add(supplier);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Supplier> GetSupplierBySupplierId(int supplierId)
        {
            try
            {
                var supplier = await _dbContext.Suppliers
                    .Where(s => s.SupplierId == supplierId)
                    .FirstOrDefaultAsync();

                return supplier;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSupplier(int supplierId, Supplier supplier)
        {
            try
            {
                var existSupplier = await _dbContext.Suppliers.FindAsync(supplierId);

                if (existSupplier != null)
                {
                    _dbContext.Entry(existSupplier).CurrentValues.SetValues(supplier);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSupplier(int supplierId)
        {
            try
            {
                var supplier= await _dbContext.Suppliers.FindAsync(supplierId);

                if (supplier != null)
                {
                    _dbContext.Suppliers.Remove(supplier);
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
