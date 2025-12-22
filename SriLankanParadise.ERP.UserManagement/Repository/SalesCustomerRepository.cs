using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SalesCustomerRepository : ISalesCustomerRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SalesCustomerRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateSalesCustomer(SalesCustomer salesCustomer)
        {
            try
            {
                _dbContext.SalesCustomers.Add(salesCustomer);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<SalesCustomer> GetById(int salesCustomerId)
        {
            try
            {
                var salesCustomer = _dbContext.SalesCustomers
                    .FirstOrDefault(sc => sc.SalesCustomerId == salesCustomerId);
                return salesCustomer != null ? salesCustomer : null!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SalesCustomer>> GetSalesCustomersByCompanyId(int companyId)
        {
            try
            {
                var salesCustomers = await _dbContext.SalesCustomers
                    .Where(sc => sc.CompanyId == companyId)
                    .ToListAsync();

                return salesCustomers.Any() ? salesCustomers : null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
