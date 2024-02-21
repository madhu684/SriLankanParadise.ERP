using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICategoryRepository
    {
        Task AddCategory(Category category);

        Task<IEnumerable<Category>> GetAll();

        Task<IEnumerable<Category>> GetCategoriesByCompanyId(int companyId);

        Task<IEnumerable<Category>> GetAllCategoriesByCompanyId(int companyId);

        Task<Category> GetCategoryByCategoryId(int categoryId);

        Task UpdateCategory(int categoryId, Category category);

        Task DeleteCategory(int categoryId);
    }
}
