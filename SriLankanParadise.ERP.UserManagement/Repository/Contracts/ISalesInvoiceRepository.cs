using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesInvoiceRepository
    {
        Task AddSalesInvoice(SalesInvoice salesInvoice);

        Task<IEnumerable<SalesInvoice>> GetAll();

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId, DateTime? date = null, string? searchQuery = null, string? filter = null, int? status = null);

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByUserId(int userId);

        Task ApproveSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice);

        Task<SalesInvoice> GetSalesInvoiceBySalesInvoiceId(int salesInvoiceId);

        Task UpdateSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice);

        Task DeleteSalesInvoice(int salesInvoiceId);

        Task<SalesInvoice> GetSalesInvoiceById(int salesInvoiceId);
        
        Task<PagedResult<SalesInvoice>> GetSalesInvoicesByCustomerSearch(string? name = null, string? phone = null, DateTime? fromDate = null, DateTime? toDate = null, int pageNumber = 1, int pageSize = 10);

        Task<PagedResult<SalesInvoice>> GetPaginatedFilteredSalesInvoiceByCompanyIdDate(int companyId, DateTime? date = null, string? searchQuery = null, string? filter = null, int pageNumber = 1, int pageSize = 10);
    }
}
