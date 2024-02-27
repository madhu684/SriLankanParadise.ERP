using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class PaymentModeService : IPaymentModeService
    {
        private readonly IPaymentModeRepository _paymentModeRepository;
        public PaymentModeService(IPaymentModeRepository paymentModeRepository)
        {
            _paymentModeRepository = paymentModeRepository;
        }

        public async Task AddPaymentMode(PaymentMode paymentMode)
        {
            await _paymentModeRepository.AddPaymentMode(paymentMode);
        }

        public async Task<IEnumerable<PaymentMode>> GetPaymentModesByCompanyId(int companyId)
        {
            return await _paymentModeRepository.GetPaymentModesByCompanyId(companyId);
        }
    }
}
