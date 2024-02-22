using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SupplierRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId)
        {
            try
            {
                var suppliers = await _dbContext.Suppliers
                    .Where(s => s.CompanyId == companyId)
                    .ToListAsync();

                if (suppliers.Any())
                {
                    return suppliers;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
