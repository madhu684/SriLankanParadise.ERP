using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICustomerService
    {
        Task AddCustomer(Customer customer);

        Task<IEnumerable<Customer>> GetAll();

        Task<Customer> GetCustomerById(int id);

        Task<IEnumerable<Customer>> GetCustomersByCompanyId(int companyId);

        Task UpdateCustomer(int customerId, Customer customer);

        Task ActiveDeactiveUser(int customerId, Customer customer);

        Task UpdateOutstandingBalance(int customerId, int m, Customer customer);

        Task<IEnumerable<Customer>> SearchCustomersByName(string searchQuery);
    }
}
