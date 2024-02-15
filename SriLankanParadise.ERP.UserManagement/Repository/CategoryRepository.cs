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
    }
}
