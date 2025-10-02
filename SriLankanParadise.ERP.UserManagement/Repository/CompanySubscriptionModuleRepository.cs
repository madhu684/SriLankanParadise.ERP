using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CompanySubscriptionModuleRepository : ICompanySubscriptionModuleRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CompanySubscriptionModuleRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddCompanySubscriptionModule(CompanySubscriptionModule companySubscriptionModule)
        {
            try
            {
                _dbContext.CompanySubscriptionModules.Add(companySubscriptionModule);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteCompanySubscriptionModule(int companySubscriptionModuleId)
        {
            try
            {
                var companySubscriptionModule = await _dbContext.CompanySubscriptionModules.FindAsync(companySubscriptionModuleId);

                if (companySubscriptionModule != null)
                {
                    _dbContext.CompanySubscriptionModules.Remove(companySubscriptionModule);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<CompanySubscriptionModule>> GetAll()
        {
            try
            {
                return await _dbContext.CompanySubscriptionModules.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<CompanySubscriptionModule> GetCompanySubscriptionModuleByCompanySubscriptionModuleId(int companySubscriptionModuleId)
        {
            try
            {
                var companySubscriptionModule = await _dbContext.CompanySubscriptionModules
                .Where(c => c.CompanySubscriptionModuleId == companySubscriptionModuleId)
                .FirstOrDefaultAsync();

                return companySubscriptionModule;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateCompanySubscriptionModule(int CompanySubscriptionModuleId, CompanySubscriptionModule CompanySubscriptionModule)
        {
            try
            {
                var existCompanySubscriptionModule = await _dbContext.CompanySubscriptionModules.FindAsync(CompanySubscriptionModuleId);

                if (existCompanySubscriptionModule != null)
                {
                    _dbContext.Entry(existCompanySubscriptionModule).CurrentValues.SetValues(CompanySubscriptionModule);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<CompanySubscriptionModule>> GetCompanySubscriptionModulesByCompanyId(int companyId)
        {
            try
            {
                var modules = await _dbContext.CompanySubscriptionModules
                    .Where(csm => csm.CompanyId == companyId)
                    .Include(csm => csm.SubscriptionModule)
                        .ThenInclude(sm => sm.Module)
                    .ToListAsync();
                
                if (modules.Any())
                {
                    return modules;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<int?> GetCompanySubscriptionModuleIdByCompanyIdAndModuleId(int companyId, int moduleId)
        {
            try
            {
                var companySubscriptionModuleId = await _dbContext.CompanySubscriptionModules
                    .Where(csm => csm.CompanyId == companyId && csm.SubscriptionModule.ModuleId == moduleId)
                    .Select(csm => csm.CompanySubscriptionModuleId)
                    .FirstOrDefaultAsync();

               
                if (companySubscriptionModuleId != 0)
                {
                    return companySubscriptionModuleId;
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

