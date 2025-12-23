using SriLankanParadise.ERP.UserManagement.DataModels;
using System.Threading.Tasks;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICustomerRepository
    {
        Task AddCustomer(Customer customer);

        Task<IEnumerable<Customer>> GetAll();

        Task<IEnumerable<Customer>> GetCustomersByCompanyId(int companyId);

        Task<IEnumerable<Customer>> GetCustomersByCustomerTypeCompanyId(int companyId, string customerType);

        Task<Customer> GetCustomerById(int id);

        Task<IEnumerable<Customer>> SearchCustomerByNamePhone(string searchTerm);

        Task UpdateCustomer(int customerId, Customer customer);

        Task ActiveDeactiveUser(int customerId, Customer customer);
    }
}
