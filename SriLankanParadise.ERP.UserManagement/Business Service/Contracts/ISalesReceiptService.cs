using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesReceiptService
    {
        Task AddSalesReceipt(SalesReceipt salesReceipt);

        Task<IEnumerable<SalesReceipt>> GetAll();

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserId(int userId);

        Task<SalesReceipt> GetSalesReceiptBySalesReceiptId(int salesReceiptId);

        Task UpdateSalesReceipt(int salesReceiptId, SalesReceipt salesReceipt);

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserIdAndDate(int userId, DateTime? date, int? cashierSessionId = null);
        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByDate(DateTime date);
    }
}
