using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesInvoiceDetailRepository
    {
        Task AddSalesInvoiceDetail(SalesInvoiceDetail salesInvoiceDetail);

        Task<SalesInvoiceDetail> GetSalesInvoiceDetailBySalesInvoiceDetailId(int salesInvoiceDetailId);

        Task UpdateSalesInvoiceDetail(int salesInvoiceDetailId, SalesInvoiceDetail salesInvoiceDetail);

        Task DeleteSalesInvoiceDetail(int salesInvoiceDetailId);
    }
}
