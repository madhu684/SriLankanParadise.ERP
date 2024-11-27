using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICompanySubscriptionModuleUserService
    {
        Task AddCompanySubscriptionModuleUser(CompanySubscriptionModuleUser companySubscriptionModuleUser);

        Task DeleteCompanySubscriptionModulesByUserId(int UserId);
    }
}
