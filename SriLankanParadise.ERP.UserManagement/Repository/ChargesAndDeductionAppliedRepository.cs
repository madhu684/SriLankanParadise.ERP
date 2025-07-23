using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileSystemGlobbing;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ChargesAndDeductionAppliedRepository : IChargesAndDeductionAppliedRepository
    { 
        private readonly ErpSystemContext _dbContext;

        public ChargesAndDeductionAppliedRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddChargesAndDeductionApplied(ChargesAndDeductionApplied chargesAndDeductionApplied)
        {
            try
            {
                _dbContext.ChargesAndDeductionApplieds.Add(chargesAndDeductionApplied);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<ChargesAndDeductionApplied>> GetChargesAndDeductionsApplied(int transactionTypeId, int transactionId, int companyId)
        {
            try
            {
                var chargesAndDeductionsApplied = await _dbContext.ChargesAndDeductionApplieds
                    .Where(cad => cad.TransactionId == transactionId && cad.TransactionTypeId == transactionTypeId && cad.CompanyId == companyId)
                    .Include(cad => cad.ChargesAndDeduction)
                    .ToListAsync();

                return chargesAndDeductionsApplied.Any() ? chargesAndDeductionsApplied : null;

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ChargesAndDeductionApplied> GetChargesAndDeductionAppliedByChargesAndDeductionAppliedId(int chargesAndDeductionAppliedId)
        {
            try
            {
                var chargesAndDeductionApplied = await _dbContext.ChargesAndDeductionApplieds
                    .Where(cad => cad.ChargesAndDeductionAppliedId == chargesAndDeductionAppliedId)
                    .FirstOrDefaultAsync();

                return chargesAndDeductionApplied;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateChargesAndDeductionApplied(int chargesAndDeductionAppliedId, ChargesAndDeductionApplied chargesAndDeductionApplied)
        {
            try
            {
                var existChargesAndDeductionApplied = await _dbContext.ChargesAndDeductionApplieds.FindAsync(chargesAndDeductionAppliedId);

                if (existChargesAndDeductionApplied != null)
                {
                    _dbContext.Entry(existChargesAndDeductionApplied).CurrentValues.SetValues(chargesAndDeductionApplied);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteChargesAndDeductionApplied(int chargesAndDeductionAppliedId)
        {
            try
            {
                var chargesAndDeductionApplied = await _dbContext.ChargesAndDeductionApplieds.FindAsync(chargesAndDeductionAppliedId);

                if (chargesAndDeductionApplied != null)
                {
                    _dbContext.ChargesAndDeductionApplieds.Remove(chargesAndDeductionApplied);
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
