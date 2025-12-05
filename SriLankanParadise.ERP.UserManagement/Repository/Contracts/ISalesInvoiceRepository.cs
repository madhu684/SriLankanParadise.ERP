using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesInvoiceRepository
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

        Task<IEnumerable<SalesInvoice>> GetSalesInvoiceByDateRange(DateTime fromDate, DateTime toDate, int? customerId = null, int? regionId = null, int? salesPersonId = null);
    }
}
