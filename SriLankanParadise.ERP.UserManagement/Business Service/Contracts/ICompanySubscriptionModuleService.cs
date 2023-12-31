﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICompanySubscriptionModuleService
    {
        Task<CompanySubscriptionModule> GetCompanySubscriptionModuleByCompanySubscriptionModuleId(int companySubscriptionModuleId);
        Task<IEnumerable<CompanySubscriptionModule>> GetAll();
        Task AddCompanySubscriptionModule(CompanySubscriptionModule companySubscriptionModule);
        Task DeleteCompanySubscriptionModule(int companySubscriptionModuleId);
        Task UpdateCompanySubscriptionModule(int companySubscriptionModuleId, CompanySubscriptionModule companySubscriptionModule);

        Task<IEnumerable<Module>> GetCompanySubscriptionModulesByCompanyId(int companyId);
    }
}
