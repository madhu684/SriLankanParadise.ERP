using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PaymentModeRepository : IPaymentModeRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PaymentModeRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddPaymentMode(PaymentMode paymentMode)
        {
            try
            {
                _dbContext.PaymentModes.Add(paymentMode);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PaymentMode>> GetPaymentModesByCompanyId(int companyId)
        {
            try
            {
                var paymentModes = await _dbContext.PaymentModes
                    .Where(pm => pm.CompanyId == companyId)
                    .ToListAsync();

                return paymentModes.Any() ? paymentModes : null;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
