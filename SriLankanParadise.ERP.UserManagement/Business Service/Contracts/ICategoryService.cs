using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICategoryService
    {
        Task AddCategory(Category category);

        Task<IEnumerable<Category>> GetAll();

        Task<IEnumerable<Category>> GetCategoriesByCompanyId(int companyId);
    }
}
