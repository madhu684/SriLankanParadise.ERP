using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CompanySubscriptionModuleUserService :ICompanySubscriptionModuleUserService
    {
        private readonly ICompanySubscriptionModuleUserRepository _companySubscriptionModuleUserRepository;
        public CompanySubscriptionModuleUserService(ICompanySubscriptionModuleUserRepository companySubscriptionModuleUserRepository)
        {
            _companySubscriptionModuleUserRepository = companySubscriptionModuleUserRepository;
        }

        public async Task AddCompanySubscriptionModuleUser(CompanySubscriptionModuleUser companySubscriptionModuleUser)
        {
            await _companySubscriptionModuleUserRepository.AddCompanySubscriptionModuleUser(companySubscriptionModuleUser);
        }
    }
}
