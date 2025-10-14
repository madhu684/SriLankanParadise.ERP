using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CustomerDeliveryAddressService : ICustomerDeliveryAddressService
    {
        private readonly ICustomerDeliveryAddressRepository _repository;

        public CustomerDeliveryAddressService(ICustomerDeliveryAddressRepository repository)
        {
            _repository = repository;
        }

        public async Task AddCustomerDeliveryAddress(CustomerDeliveryAddress customerDeliveryAddress)
        {
            await _repository.AddCustomerDeliveryAddress(customerDeliveryAddress);
        }

        public async Task DeleteCustomerDeliveryAddress(int id)
        {
            await _repository.DeleteCustomerDeliveryAddress(id);
        }

        public async Task<CustomerDeliveryAddress> GetCustomerDeliveryAddressById(int id)
        {
            return await _repository.GetCustomerDeliveryAddressById(id);
        }

        public async Task<IEnumerable<CustomerDeliveryAddress>> GetCustomerDeliveryAddressesByCustomerId(int customerId)
        {
            return await _repository.GetCustomerDeliveryAddressesByCustomerId(customerId);
        }

        public async Task UpdateCustomerDeliveryAddress(int id, CustomerDeliveryAddress customerDeliveryAddress)
        {
            await _repository.UpdateCustomerDeliveryAddress(id, customerDeliveryAddress);
        }
    }
}
