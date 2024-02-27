using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesReceiptSalesInvoiceService : ISalesReceiptSalesInvoiceService
    {
        private readonly ISalesReceiptSalesInvoiceRepository _salesReceiptSalesInvoiceRepository;
        public SalesReceiptSalesInvoiceService(ISalesReceiptSalesInvoiceRepository salesReceiptSalesInvoiceRepository)
        {
            _salesReceiptSalesInvoiceRepository = salesReceiptSalesInvoiceRepository;
        }

        public async Task AddSalesReceiptSalesInvoice(SalesReceiptSalesInvoice salesReceiptSalesInvoice)
        {
            await _salesReceiptSalesInvoiceRepository.AddSalesReceiptSalesInvoice(salesReceiptSalesInvoice);
        }

        public async Task<SalesReceiptSalesInvoice> GetSalesReceiptSalesInvoiceBySalesReceiptSalesInvoiceId(int salesReceiptSalesInvoiceId)
        {
            return await _salesReceiptSalesInvoiceRepository.GetSalesReceiptSalesInvoiceBySalesReceiptSalesInvoiceId(salesReceiptSalesInvoiceId);
        }

        public async Task UpdateSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId, SalesReceiptSalesInvoice salesReceiptSalesInvoice)
        {
            await _salesReceiptSalesInvoiceRepository.UpdateSalesReceiptSalesInvoice(salesReceiptSalesInvoiceId, salesReceiptSalesInvoice);
        }

        public async Task DeleteSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId)
        {
            await _salesReceiptSalesInvoiceRepository.DeleteSalesReceiptSalesInvoice(salesReceiptSalesInvoiceId);
        }
    }
}
