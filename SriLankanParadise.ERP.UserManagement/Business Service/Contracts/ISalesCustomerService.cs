using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesCustomerService
    {
        Task CreateSalesCustomer(SalesCustomer salesCustomer);
        Task<SalesCustomer> GetById(int salesCustomerId);
        Task<IEnumerable<SalesCustomer>> GetSalesCustomersByCompanyId(int companyId);
    }
}
