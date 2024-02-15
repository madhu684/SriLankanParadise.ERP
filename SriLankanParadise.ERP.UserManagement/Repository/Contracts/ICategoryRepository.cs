using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICategoryRepository
    {
        Task AddCategory(Category category);

        Task<IEnumerable<Category>> GetAll();

        Task<IEnumerable<Category>> GetCategoriesByCompanyId(int companyId);
    }
}
