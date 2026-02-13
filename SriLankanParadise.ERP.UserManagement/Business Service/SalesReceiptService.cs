using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesReceiptService : ISalesReceiptService
    {
        private readonly ISalesReceiptRepository _salesReceiptRepository;
        public SalesReceiptService(ISalesReceiptRepository salesReceiptRepository)
        {
            _salesReceiptRepository = salesReceiptRepository;
        }

        public async Task AddSalesReceipt(SalesReceipt salesReceipt)
        {
            await _salesReceiptRepository.AddSalesReceipt(salesReceipt);
        }

        public async Task<IEnumerable<SalesReceipt>> GetAll()
        {
            return await _salesReceiptRepository.GetAll();
        }

        public async Task<PagedResult<SalesReceipt>> GetSalesReceiptsWithoutDraftsByCompanyId(int companyId, DateTime? date = null, int? createdUserId = null, string? filter = null, string? searchQuery = null, int pageNumber = 1, int pageSize = 10)
        {
            return await _salesReceiptRepository.GetSalesReceiptsWithoutDraftsByCompanyId(companyId, date, createdUserId, filter, searchQuery, pageNumber, pageSize);
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserId(int userId)
        {
            return await _salesReceiptRepository.GetSalesReceiptsByUserId(userId);
        }

        
        public async Task<SalesReceipt> GetSalesReceiptBySalesReceiptId(int salesReceiptId)
        {
            return await _salesReceiptRepository.GetSalesReceiptBySalesReceiptId(salesReceiptId);
        }

        public async Task UpdateSalesReceipt(int salesReceiptId, SalesReceipt salesReceipt)
        {
            await _salesReceiptRepository.UpdateSalesReceipt(salesReceiptId, salesReceipt);
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserIdAndDate(int userId, DateTime? date, int? cashierSessionId = null)
        {
            return await _salesReceiptRepository.GetSalesReceiptsByUserIdAndDate(userId, date, cashierSessionId);
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByDate(DateTime date)
        {
            return await _salesReceiptRepository.GetSalesReceiptsByDate(date);
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsBySessionId(int sessionId)
        {
            return await _salesReceiptRepository.GetSalesReceiptsBySessionId(sessionId);
        }

        public async Task ReverseSalesReceipt(int salesReceiptId)
        {
            await _salesReceiptRepository.ReverseSalesReceipt(salesReceiptId);
        }
    }
}
