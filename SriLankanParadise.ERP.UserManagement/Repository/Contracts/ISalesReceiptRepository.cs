using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesReceiptRepository
    {
        Task AddSalesReceipt(SalesReceipt salesReceipt);

        Task<IEnumerable<SalesReceipt>> GetAll();

        Task<PagedResult<SalesReceipt>> GetSalesReceiptsWithoutDraftsByCompanyId(int companyId, DateTime? date = null, int? createdUserId = null, string? filter = null, string? searchQuery = null, int pageNumber = 1, int pageSize = 10);

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserId(int userId);

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsBySessionId(int sessionId);

        Task<SalesReceipt> GetSalesReceiptBySalesReceiptId(int salesReceiptId);

        Task UpdateSalesReceipt(int salesReceiptId, SalesReceipt salesReceipt);

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserIdAndDate(int userId, DateTime? date, int? cashierSessionId = null);

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByDate(DateTime date);

        Task ReverseSalesReceipt(int salesReceiptId);
    }
}
