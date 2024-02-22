using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IPaymentModeService
    {
        Task AddPaymentMode(PaymentMode paymentMode);

        Task<IEnumerable<PaymentMode>> GetPaymentModesByCompanyId(int companyId);
    }
}
