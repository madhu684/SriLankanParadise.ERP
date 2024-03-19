using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ChargesAndDeductionRepository : IChargesAndDeductionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ChargesAndDeductionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddChargesAndDeduction(ChargesAndDeduction chargesAndDeduction)
        {
            try
            {
                _dbContext.ChargesAndDeductions.Add(chargesAndDeduction);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        
        public async Task<IEnumerable<ChargesAndDeduction>> GetChargesAndDeductionsByCompanyId(int companyId)
        {
            try
            {
                DateTime currentDateTime = DateTime.Now;

                var chargesAndDeductions = await _dbContext.ChargesAndDeductions
                    .Where(cd => cd.CompanyId == companyId && cd.DateApplied <= currentDateTime)
                    .ToListAsync();

                return chargesAndDeductions.Any() ? chargesAndDeductions : null;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
