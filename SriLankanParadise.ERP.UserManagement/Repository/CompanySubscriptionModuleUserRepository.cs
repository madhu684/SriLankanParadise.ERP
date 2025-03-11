using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class CompanySubscriptionModuleUserRepository : ICompanySubscriptionModuleUserRepository
    {
        private readonly ErpSystemContext _dbContext;

        public CompanySubscriptionModuleUserRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddCompanySubscriptionModuleUser(CompanySubscriptionModuleUser companySubscriptionModuleUser)
        {
            try
            {
                _dbContext.CompanySubscriptionModuleUsers.Add(companySubscriptionModuleUser);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteCompanySubscriptionModulesByUserId(int UserId)
        {
            try
            {
                var companySubscriptionModuleUser = await _dbContext.CompanySubscriptionModuleUsers
                    .Where(x => x.UserId == UserId).ToListAsync();

                if (companySubscriptionModuleUser != null && companySubscriptionModuleUser.Count > 0)
                {
                    _dbContext.CompanySubscriptionModuleUsers.RemoveRange(companySubscriptionModuleUser);
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
