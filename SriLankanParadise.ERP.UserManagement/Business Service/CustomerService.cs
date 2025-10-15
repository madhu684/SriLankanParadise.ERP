using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
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

        public async Task ActiveDeactiveUser(int customerId, Customer customer)
        {
            await _customerRepository.ActiveDeactiveUser(customerId, customer);
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

        public async Task<IEnumerable<Customer>> GetCustomersByCompanyId(int companyId)
        {
            return await _customerRepository.GetCustomersByCompanyId(companyId);
        }

        public Task<IEnumerable<Customer>> SearchCustomersByName(string searchQuery)
        {
            return _customerRepository.SearchCustomersByName(searchQuery);
        }

        public async Task UpdateCustomer(int customerId, Customer customer)
        {
            await _customerRepository.UpdateCustomer(customerId, customer);
        }
    }
}
