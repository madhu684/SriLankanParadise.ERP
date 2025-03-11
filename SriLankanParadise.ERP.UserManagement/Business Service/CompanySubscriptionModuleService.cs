using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CompanySubscriptionModuleService : ICompanySubscriptionModuleService
    {
        private readonly ICompanySubscriptionModuleRepository _companySubscriptionModuleRepository;
        public CompanySubscriptionModuleService(ICompanySubscriptionModuleRepository companySubscriptionModuleRepository)
        {
            _companySubscriptionModuleRepository = companySubscriptionModuleRepository;
        }
        public async Task AddCompanySubscriptionModule(CompanySubscriptionModule companySubscriptionModule)
        {
            await _companySubscriptionModuleRepository.AddCompanySubscriptionModule(companySubscriptionModule);
        }

        public async Task DeleteCompanySubscriptionModule(int companySubscriptionModuleId)
        {
            await _companySubscriptionModuleRepository.DeleteCompanySubscriptionModule(companySubscriptionModuleId);
        }

        public async Task<IEnumerable<CompanySubscriptionModule>> GetAll()
        {
            return await _companySubscriptionModuleRepository.GetAll();
        }

        public async Task<CompanySubscriptionModule> GetCompanySubscriptionModuleByCompanySubscriptionModuleId(int companySubscriptionModuleId)
        {
            return await _companySubscriptionModuleRepository.GetCompanySubscriptionModuleByCompanySubscriptionModuleId(companySubscriptionModuleId);
        }

        public async Task UpdateCompanySubscriptionModule(int companySubscriptionModuleId, CompanySubscriptionModule companySubscriptionModule)
        {
            await _companySubscriptionModuleRepository.UpdateCompanySubscriptionModule(companySubscriptionModuleId, companySubscriptionModule); 
        }

        public async Task<IEnumerable<CompanySubscriptionModule>> GetCompanySubscriptionModulesByCompanyId(int companyId)
        {
            return await _companySubscriptionModuleRepository.GetCompanySubscriptionModulesByCompanyId(companyId);
        }

        public async Task<int?> GetCompanySubscriptionModuleIdByCompanyIdAndModuleId(int companyId, int moduleId)
        {
            return await _companySubscriptionModuleRepository.GetCompanySubscriptionModuleIdByCompanyIdAndModuleId(companyId, moduleId);
        }
    }
}
