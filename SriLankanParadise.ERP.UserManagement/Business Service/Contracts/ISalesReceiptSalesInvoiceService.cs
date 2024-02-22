using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesReceiptSalesInvoiceService
    {
        Task AddSalesReceiptSalesInvoice(SalesReceiptSalesInvoice salesReceiptSalesInvoice);

        Task<SalesReceiptSalesInvoice> GetSalesReceiptSalesInvoiceBySalesReceiptSalesInvoiceId(int salesReceiptSalesInvoiceId);

        Task UpdateSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId, SalesReceiptSalesInvoice salesReceiptSalesInvoice);

        Task DeleteSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId);
    }
}
