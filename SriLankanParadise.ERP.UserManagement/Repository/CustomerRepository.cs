using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
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
        public async Task AddCustomer(Customer customer)
        {
            try
            {
                var isExists = await _dbContext.Customers.AnyAsync(c => c.CustomerName == customer.CustomerName && c.Phone == customer.Phone);
                if (isExists)
                {
                    throw new Exception("A customer with the same name and phone number already exists.");
                }

                customer.CreatedDate = DateTime.Now;
                customer.CompanyId = customer.CompanyId != null ? customer.CompanyId : 1;
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

        public async Task<IEnumerable<Customer>> SearchCustomerByNamePhone(string searchTerm)
        {
            try
            {
                if (string.IsNullOrEmpty(searchTerm))
                {
                    return null;
                }

                // Apply search query
                var query = _dbContext.Customers.Where(im => im.CustomerName.Contains(searchTerm) || im.Phone.Contains(searchTerm));
                var customers = await query.ToListAsync();

                return customers.Any() ? customers : null!;
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

        public async Task<IEnumerable<Customer>> GetCustomersByCustomerTypeCompanyId(int companyId, string customerType)
        {
            try
            {
                var customers = await _dbContext.Customers.Where(c => c.CompanyId == companyId && c.CustomerType == customerType).ToListAsync();
                return customers.Any() ? customers : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<PagedResult<Customer>> GetPaginatedCustomersByCompanyId(int companyId, string? customerType = null, string? searchQuery = null, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                // Input validation
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var query = _dbContext.Customers
                    .AsNoTracking()
                    .Where(cu => cu.CompanyId == companyId);

                if (!string.IsNullOrEmpty(customerType))
                {
                    query = query.Where(cu => cu.CustomerType == customerType);
                }

                if (!string.IsNullOrEmpty(searchQuery))
                {
                    var searchTerm = searchQuery.ToLower().Trim();
                    query = query.Where(cu =>
                        cu.CustomerName.ToLower().Contains(searchTerm) ||
                        cu.Phone.Contains(searchTerm)
                    );
                }

                var totalCount = await query.CountAsync();

                // Apply pagination and ordering
                var items = await query
                    .OrderBy(cu => cu.CustomerName)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<Customer>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };

            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
