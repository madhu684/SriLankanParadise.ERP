using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICompanyTypeService
    {
        Task AddCompanyType(CompanyType companyType);

        Task<IEnumerable<CompanyType>> GetAll();
    }
}
