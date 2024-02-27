using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesReceiptSalesInvoiceRepository
    {
        Task AddSalesReceiptSalesInvoice(SalesReceiptSalesInvoice salesReceiptSalesInvoice);

        Task<SalesReceiptSalesInvoice> GetSalesReceiptSalesInvoiceBySalesReceiptSalesInvoiceId(int salesReceiptSalesInvoiceId);

        Task UpdateSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId, SalesReceiptSalesInvoice salesReceiptSalesInvoice);

        Task DeleteSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId);
    }
}
