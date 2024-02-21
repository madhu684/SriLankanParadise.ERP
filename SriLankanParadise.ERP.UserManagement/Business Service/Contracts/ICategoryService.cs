using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICategoryService
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
