using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICompanySubscriptionModuleUserRepository
    {
        Task AddCompanySubscriptionModuleUser(CompanySubscriptionModuleUser companySubscriptionModuleUser);

        Task DeleteCompanySubscriptionModulesByUserId(int UserId);
    }
}
