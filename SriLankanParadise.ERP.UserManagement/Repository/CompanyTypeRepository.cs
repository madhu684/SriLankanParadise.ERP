using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CompanyTypeRepository : ICompanyTypeRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CompanyTypeRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddCompanyType(CompanyType companyType)
        {
            try
            {
                _dbContext.CompanyTypes.Add(companyType);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<CompanyType>> GetAll()
        {
            try
            {
                return await _dbContext.CompanyTypes.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
