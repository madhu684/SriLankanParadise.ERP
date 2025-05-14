using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICustomerRepository
    {
        Task AddCustomer(Customer customer);

        Task<IEnumerable<Customer>> GetAll();

        Task<Customer> GetCustomerById(int id);

        Task<IEnumerable<Customer>> GetCustomersByCompanyId(int companyId);
    }
}
