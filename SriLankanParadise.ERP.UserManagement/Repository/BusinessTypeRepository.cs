using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class BusinessTypeRepository : IBusinessTypeRepository
    {
        private readonly ErpSystemContext _dbContext;

        public BusinessTypeRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddBusinessType(BusinessType businessType)
        {
            try
            {
                _dbContext.BusinessTypes.Add(businessType);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<BusinessType>> GetAll()
        {
            try
            {
                return await _dbContext.BusinessTypes.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
