using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CustomerDeliveryAddressRepository : ICustomerDeliveryAddressRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CustomerDeliveryAddressRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddCustomerDeliveryAddress(CustomerDeliveryAddress customerDeliveryAddress)
        {
            try
            {
                _dbContext.CustomerDeliveryAddresses.Add(customerDeliveryAddress);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteCustomerDeliveryAddress(int id)
        {
            try
            {
                var address = await _dbContext.CustomerDeliveryAddresses.FindAsync(id);
                if (address != null)
                {
                    _dbContext.CustomerDeliveryAddresses.Remove(address);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<CustomerDeliveryAddress> GetCustomerDeliveryAddressById(int id)
        {
            try
            {
                var address = await _dbContext.CustomerDeliveryAddresses
                    .Where(cda => cda.Id == id)
                    .FirstOrDefaultAsync();

                return address;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<CustomerDeliveryAddress>> GetCustomerDeliveryAddressesByCustomerId(int customerId)
        {
            try
            {
                var addresses = await _dbContext.CustomerDeliveryAddresses
                    .Where(cda => cda.CustomerId == customerId)
                    .ToListAsync();


                return addresses.Any() ? addresses : Enumerable.Empty<CustomerDeliveryAddress>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateCustomerDeliveryAddress(int id, CustomerDeliveryAddress customerDeliveryAddress)
        {
            try
            {
                var existAddress = await _dbContext.CustomerDeliveryAddresses.FindAsync(id);
                if (existAddress != null)
                {
                    _dbContext.Entry(existAddress).CurrentValues.SetValues(customerDeliveryAddress);
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
