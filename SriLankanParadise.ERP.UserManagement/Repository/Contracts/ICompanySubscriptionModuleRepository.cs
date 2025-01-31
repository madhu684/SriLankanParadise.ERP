﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICompanySubscriptionModuleRepository
    {
        Task<CompanySubscriptionModule> GetCompanySubscriptionModuleByCompanySubscriptionModuleId(int companySubscriptionModuleId);
        Task<IEnumerable<CompanySubscriptionModule>> GetAll();
        Task AddCompanySubscriptionModule(CompanySubscriptionModule companySubscriptionModule);
        Task DeleteCompanySubscriptionModule(int companySubscriptionModuleId);
        Task UpdateCompanySubscriptionModule(int companySubscriptionModuleId, CompanySubscriptionModule companySubscriptionModule);

        Task<IEnumerable<CompanySubscriptionModule>> GetCompanySubscriptionModulesByCompanyId(int companyId);

        Task<int?> GetCompanySubscriptionModuleIdByCompanyIdAndModuleId(int companyId, int moduleId);
    }
}
