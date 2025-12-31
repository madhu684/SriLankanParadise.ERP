using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
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

        Task<PagedResult<Customer>> GetPaginatedCustomersByCompanyId(int companyId, string? customerType = null, string? searchQuery = null, int pageNumber = 1, int pageSize = 10);
    }
}
