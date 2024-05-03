using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CompanyTypeService : ICompanyTypeService
    {
        private readonly ICompanyTypeRepository _companyTypeRepository;
        public CompanyTypeService(ICompanyTypeRepository companyTypeRepository)
        {
            _companyTypeRepository = companyTypeRepository;
        }

        public async Task AddCompanyType(CompanyType companyType)
        {
            await _companyTypeRepository.AddCompanyType(companyType);
        }

        public async Task<IEnumerable<CompanyType>> GetAll()
        {
            return await _companyTypeRepository.GetAll();
        }
    }
}
