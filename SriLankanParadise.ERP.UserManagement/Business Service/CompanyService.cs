using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        public CompanyService(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        public async Task AddCompany(Company company)
        {
            await _companyRepository.AddCompany(company);
        }

        public async Task DeleteCompany(int companyId)
        {
            await _companyRepository.DeleteCompany(companyId);
        }

        public async Task<IEnumerable<Company>> GetAll()
        {
            return await _companyRepository.GetAll();
        }

        public async Task<Company> GetCompanyByCompanyId(int companyId)
        {
            return await _companyRepository.GetCompanyByCompanyId(companyId);
        }

        public async Task UpdateCompany(int companyId, Company company)
        {
            await _companyRepository.UpdateCompany(companyId, company);
        }
    }
}
