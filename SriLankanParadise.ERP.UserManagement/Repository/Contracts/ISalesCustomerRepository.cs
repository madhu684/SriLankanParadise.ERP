using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesCustomerRepository
    {
        Task CreateSalesCustomer (SalesCustomer salesCustomer);
        Task<SalesCustomer> GetById(int salesCustomerId);
        Task<IEnumerable<SalesCustomer>> GetSalesCustomersByCompanyId(int companyId);
    }
}
