using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICompanyService
    {
        Task<Company> GetCompanyByCompanyId(int companyId);
        Task<IEnumerable<Company>> GetAll();
        Task AddCompany(Company company);
        Task DeleteCompany(int companyId);
        Task UpdateCompany(int companyId, Company company);

        Task<string> UploadCompanyLogo(IFormFile file);
    }
}
