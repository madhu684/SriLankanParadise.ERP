using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SupplierCategoryRepository : ISupplierCategoryRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SupplierCategoryRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        

        public async Task AddSupplierCategory(SupplierCategory supplierCategory)
        {
            try
            {
                _dbContext.SupplierCategories.Add(supplierCategory);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<SupplierCategory> GetSupplierCategoryBySupplierCategoryId(int supplierCategoryId)
        {
            try
            {
                var supplierCategory= await _dbContext.SupplierCategories
                    .Where(sc => sc.SupplierCategoryId == supplierCategoryId)
                    .FirstOrDefaultAsync();

                return supplierCategory;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteSupplierCategory(int supplierCategoryId)
        {
            try
            {
                var supplierCategory= await _dbContext.SupplierCategories.FindAsync(supplierCategoryId);

                if (supplierCategory != null)
                {
                    _dbContext.SupplierCategories.Remove(supplierCategory);
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
