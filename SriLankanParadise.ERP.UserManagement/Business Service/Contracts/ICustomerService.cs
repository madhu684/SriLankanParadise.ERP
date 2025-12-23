using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ICustomerService
    {
        Task AddCustomer(Customer customer);

        Task<IEnumerable<Customer>> GetAll();

        Task<Customer> GetCustomerById(int id);

        Task<IEnumerable<Customer>> GetCustomersByCompanyId(int companyId);

        Task<IEnumerable<Customer>> GetCustomersByCustomerTypeCompanyId(int companyId, string customerType);

        Task<IEnumerable<Customer>> SearchCustomerByNamePhone(string searchTerm);

        Task UpdateCustomer(int customerId, Customer customer);

        Task ActiveDeactiveUser(int customerId, Customer customer);
    }
}
