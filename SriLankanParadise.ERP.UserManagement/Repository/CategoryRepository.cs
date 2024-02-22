using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CategoryRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddCategory(Category category)
        {
            try
            {
                _dbContext.Categories.Add(category);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Category>> GetAll()
        {
            try
            {
                return await _dbContext.Categories.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<Category>> GetCategoriesByCompanyId(int companyId)
        {
            try
            {
                var categories = await _dbContext.Categories
                    .Where(c => c.Status == true && c.CompanyId == companyId)
                    .ToListAsync();

                return categories.Any() ? categories : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesByCompanyId(int companyId)
        {
            try
            {
                var categories = await _dbContext.Categories
                    .Where(c => c.CompanyId == companyId)
                    .ToListAsync();

                return categories.Any() ? categories : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Category> GetCategoryByCategoryId(int categoryId)
        {
            try
            {
                var itemMaster = await _dbContext.Categories
                    .Where(c => c.CategoryId == categoryId)
                    .FirstOrDefaultAsync();

                return itemMaster;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateCategory(int categoryId, Category category)
        {
            try
            {
                var existCategory = await _dbContext.Categories.FindAsync(categoryId);

                if (existCategory != null)
                {
                    _dbContext.Entry(existCategory).CurrentValues.SetValues(category);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteCategory(int categoryId)
        {
            try
            {
                var category = await _dbContext.Categories.FindAsync(categoryId);

                if (category != null)
                {
                    _dbContext.Categories.Remove(category);
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
