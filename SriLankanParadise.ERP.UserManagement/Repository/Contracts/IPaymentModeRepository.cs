using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IPaymentModeRepository
    {
        Task AddPaymentMode(PaymentMode paymentMode);

        Task<IEnumerable<PaymentMode>> GetPaymentModesByCompanyId(int companyId);
    }
}
