using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICompanyRepository
    {
        Task<Company> GetCompanyByCompanyId(int companyId);
        Task<IEnumerable<Company>> GetAll();
        Task AddCompany(Company company);
        Task DeleteCompany(int companyId);
        Task UpdateCompany(int companyId, Company company);
    }
}
