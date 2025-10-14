using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ICustomerDeliveryAddressRepository
    {
        Task AddCustomerDeliveryAddress(CustomerDeliveryAddress customerDeliveryAddress);
        Task<CustomerDeliveryAddress> GetCustomerDeliveryAddressById(int id);
        Task<IEnumerable<CustomerDeliveryAddress>> GetCustomerDeliveryAddressesByCustomerId(int customerId);
        Task UpdateCustomerDeliveryAddress(int id, CustomerDeliveryAddress customerDeliveryAddress);
        Task DeleteCustomerDeliveryAddress(int id);
    }
}
