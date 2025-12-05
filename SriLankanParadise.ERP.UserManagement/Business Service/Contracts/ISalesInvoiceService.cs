using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesInvoiceService
    {
        Task AddSalesInvoice(SalesInvoice salesInvoice);

        Task<IEnumerable<SalesInvoice>> GetAll();

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByUserId(int userId);

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByCustomerIdStatus(int customerId, int status);

        Task ApproveSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice);

        Task<SalesInvoice> GetSalesInvoiceBySalesInvoiceId(int salesInvoiceId);

        Task UpdateSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice);

        Task DeleteSalesInvoice(int salesInvoiceId);

        Task<SalesInvoice> GetSalesInvoiceById(int salesInvoiceId);

        Task<IEnumerable<SalesInvoice>> GetSalesInvoiceByReference(string reference, int status);

        Task<PagedResult<SalesInvoice>> GetSalesInvoiceByDateRange(DateTime fromDate, DateTime toDate, int? customerId = null, int? regionId = null, int? salesPersonId = null, int pageNumber = 1, int pageSize = 10);
    }
}
