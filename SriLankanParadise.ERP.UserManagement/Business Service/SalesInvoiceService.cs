using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
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

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId)
        {
            return await _salesInvoiceRepository.GetSalesInvoicesWithoutDraftsByCompanyId(companyId);
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

        public Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByCustomerIdStatus(int customerId, int status)
        {
            return _salesInvoiceRepository.GetSalesInvoicesByCustomerIdStatus(customerId, status);
        }

        public Task<IEnumerable<SalesInvoice>> GetSalesInvoiceByReference(string reference, int status)
        {
            return _salesInvoiceRepository.GetSalesInvoiceByReference(reference, status);
        }

        public async Task<IEnumerable<SalesInvoice>> GetSalesInvoiceByDateRange(DateTime fromDate, DateTime toDate)
        {
            return await _salesInvoiceRepository.GetSalesInvoiceByDateRange(fromDate, toDate);
        }
    }
}
