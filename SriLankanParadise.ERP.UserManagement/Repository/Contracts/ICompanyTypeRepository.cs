using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICompanyTypeRepository
    {
        Task AddCompanyType(CompanyType companyType);

        Task<IEnumerable<CompanyType>> GetAll();
    }
}
