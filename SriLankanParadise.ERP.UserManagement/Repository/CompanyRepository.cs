using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CompanyRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddCompany(Company company)
        {
            try
            {
                _dbContext.Companies.Add(company);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteCompany(int companyId)
        {
            try
            {
                var company = await _dbContext.Companies.FindAsync(companyId);

                if (company != null)
                {
                    _dbContext.Companies.Remove(company);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Company>> GetAll()
        {
            try
            {
                return await _dbContext.Companies.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Company> GetCompanyByCompanyId(int companyId)
        {
            try
            {
                var company = await _dbContext.Companies
                .Where(c => c.CompanyId == companyId)
                .Where(c => c.SubscriptionExpiredDate.HasValue && c.SubscriptionExpiredDate > DateTime.UtcNow)
                .FirstOrDefaultAsync();
                
                return company;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateCompany(int companyId, Company company)
        {
            try
            {
                var existCompany = await _dbContext.Companies.FindAsync(companyId);

                if (existCompany != null)
                {
                    // Update the properties one by one of the retrieved company
                    //existCompany.CompanyName = company.CompanyName;
                    //existCompany.SubscriptionPlanId = company.SubscriptionPlanId;
                    //existCompany.SubscriptionExpiredDate = company.SubscriptionExpiredDate;

                    _dbContext.Entry(existCompany).CurrentValues.SetValues(company);
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
