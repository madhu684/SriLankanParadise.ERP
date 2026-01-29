using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesInvoiceService : ISalesInvoiceService
    {
        private readonly ISalesInvoiceRepository _salesInvoiceRepository;
        public SalesInvoiceService(ISalesInvoiceRepository salesInvoiceRepository)
        {
            _salesInvoiceRepository = salesInvoiceRepository;
        }

        public async Task AddSalesInvoice(SalesInvoice salesInvoice)
        {
            await _salesInvoiceRepository.AddSalesInvoice(salesInvoice);
        }

        public async Task<IEnumerable<SalesInvoice>> GetAll()
        {
            return await _salesInvoiceRepository.GetAll();
        }

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId, DateTime? date = null, string? searchQuery = null, string? filter = null, int? status = null)
        {
            return await _salesInvoiceRepository.GetSalesInvoicesWithoutDraftsByCompanyId(companyId, date, searchQuery, filter, status);
        }

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByUserId(int userId)
        {
            return await _salesInvoiceRepository.GetSalesInvoicesByUserId(userId);
        }

        public async Task ApproveSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice)
        {
            await _salesInvoiceRepository.ApproveSalesInvoice(salesInvoiceId, salesInvoice);
        }

        public async Task<SalesInvoice> GetSalesInvoiceBySalesInvoiceId(int salesInvoiceId)
        {
            return await _salesInvoiceRepository.GetSalesInvoiceBySalesInvoiceId(salesInvoiceId);
        }

        public async Task UpdateSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice)
        {
            await _salesInvoiceRepository.UpdateSalesInvoice(salesInvoiceId, salesInvoice);
        }

        public async Task DeleteSalesInvoice(int salesInvoiceId)
        {
            await _salesInvoiceRepository.DeleteSalesInvoice(salesInvoiceId);
        }

        public async Task<SalesInvoice> GetSalesInvoiceById(int salesInvoiceId)
        {
            return await _salesInvoiceRepository.GetSalesInvoiceById(salesInvoiceId);
        }

        public async Task<PagedResult<SalesInvoice>> GetSalesInvoicesByCustomerSearch(string? name = null, string? phone = null, DateTime? fromDate = null, DateTime? toDate = null, int pageNumber = 1, int pageSize = 10)
        {
            return await _salesInvoiceRepository.GetSalesInvoicesByCustomerSearch(name, phone, fromDate, toDate, pageNumber, pageSize);
        }

        public async Task<PagedResult<SalesInvoice>> GetPaginatedFilteredSalesInvoiceByCompanyIdDate(int companyId, DateTime? date = null, string? searchQuery = null, string? filter = null, int pageNumber = 1, int pageSize = 10)
        {
            return await _salesInvoiceRepository.GetPaginatedFilteredSalesInvoiceByCompanyIdDate(companyId, date, searchQuery, filter, pageNumber, pageSize);
        }
    }
}
