using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;
using System.ComponentModel.Design;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CustomerRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task ActiveDeactiveUser(int customerId, Customer customer)
        {
            try
            {
                var existingCustomer = await _dbContext.Customers.FindAsync(customerId);
                if (existingCustomer != null)
                {
                    existingCustomer.Status = customer.Status;
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
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
                    .Include(c => c.CustomerDeliveryAddress)
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
                var customer = await _dbContext.Customers
                    .Include(c => c.CustomerDeliveryAddress)
                    .FirstOrDefaultAsync(c => c.CustomerId == id);
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
                    .Include(c => c.CustomerDeliveryAddress)
                    .ToListAsync();

                return customers.Any() ? customers : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Customer>> SearchCustomersByName(string searchQuery)
        {
            try
            {
                // Check if searchQuery is provided
                if (string.IsNullOrEmpty(searchQuery))
                {
                    return null;
                }

                var query = _dbContext.Customers.Where(cu => cu.Status == 1);

                // Apply search query
                query = query.Where(cu => cu.CustomerName.Contains(searchQuery) || cu.CustomerCode.Contains(searchQuery));

                query = query.Include(cu => cu.CustomerDeliveryAddress);

                var customers = await query.ToListAsync();
                return customers.Any() ? customers : null!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateCustomer(int customerId, Customer customer)
        {
            try
            {
                var existingCustomer = await _dbContext.Customers.FindAsync(customerId);
                if (existingCustomer != null)
                {
                    _dbContext.Entry(existingCustomer).CurrentValues.SetValues(customer);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateOutstandingBalance(int customerId, int m, Customer customer)
        {
            try
            {
                var existingCustomer = await _dbContext.Customers.FindAsync(customerId);
                if (existingCustomer != null)
                {
                    if(m == 1)
                    {
                        existingCustomer.OutstandingAmount += customer.OutstandingAmount;
                    }
                    else if (m == 2)
                    {
                        existingCustomer.OutstandingAmount -= customer.OutstandingAmount;
                    }
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
