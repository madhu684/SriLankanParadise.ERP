using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesCustomerService : ISalesCustomerService
    {
        private readonly ISalesCustomerRepository _salesCustomerRepository;

        public SalesCustomerService(ISalesCustomerRepository salesCustomerRepository)
        {
            _salesCustomerRepository = salesCustomerRepository;
        }

        public async Task CreateSalesCustomer(SalesCustomer salesCustomer)
        {
            await _salesCustomerRepository.CreateSalesCustomer(salesCustomer);
        }

        public async Task<SalesCustomer> GetById(int salesCustomerId)
        {
            return await _salesCustomerRepository.GetById(salesCustomerId);
        }

        public async Task<IEnumerable<SalesCustomer>> GetSalesCustomersByCompanyId(int companyId)
        {
            return await _salesCustomerRepository.GetSalesCustomersByCompanyId(companyId);
        }
    }
}
