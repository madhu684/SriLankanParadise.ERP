using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task AddCustomer(Customer customer)
        {
            await _customerRepository.AddCustomer(customer);
        }

        public async Task<IEnumerable<Customer>> GetAll()
        {
            return await _customerRepository.GetAll();
        }

        public async Task<Customer> GetCustomerById(int id)
        {
            return await _customerRepository.GetCustomerById(id);
        }

        public Task<IEnumerable<Customer>> SearchCustomerByNamePhone(string searchTerm)
        {
            return _customerRepository.SearchCustomerByNamePhone(searchTerm);
        }

        public async Task<IEnumerable<Customer>> GetCustomersByCompanyId(int companyId)
        {
            return await _customerRepository.GetCustomersByCompanyId(companyId);
        }

        public async Task UpdateCustomer(int customerId, Customer customer)
        {
            await _customerRepository.UpdateCustomer(customerId, customer);
        }

        public async Task ActiveDeactiveUser(int customerId, Customer customer)
        {
            await _customerRepository.ActiveDeactiveUser(customerId, customer);
        }

        public async Task<IEnumerable<Customer>> GetCustomersByCustomerTypeCompanyId(int companyId, string customerType)
        {
            return await _customerRepository.GetCustomersByCustomerTypeCompanyId(companyId, customerType);
        }

        public async Task<PagedResult<Customer>> GetPaginatedCustomersByCompanyId(int companyId, string? customerType = null, string? searchQuery = null, int pageNumber = 1, int pageSize = 10)
        {
            return await _customerRepository.GetPaginatedCustomersByCompanyId(companyId, customerType, searchQuery, pageNumber, pageSize);
        }
    }
}
