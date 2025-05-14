using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CustomerRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddCustomer(Customer customer)
        {
            try
            {
                _dbContext.Customers.Add(customer);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Customer>> GetAll()
        {
            try
            {
                return await _dbContext.Customers
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Customer> GetCustomerById(int id)
        {
            try
            {
                var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.CustomerId == id);
                return customer != null ? customer : null!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<Customer>> GetCustomersByCompanyId(int companyId)
        {
            try
            {
                var customers = await _dbContext.Customers
                    .Where(c => c.CompanyId == companyId)
                    .ToListAsync();

                return customers.Any() ? customers : null;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
