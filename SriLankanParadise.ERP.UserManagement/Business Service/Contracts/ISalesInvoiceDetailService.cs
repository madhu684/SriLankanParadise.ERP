using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesInvoiceDetailService
    {
        Task AddSalesInvoiceDetail(SalesInvoiceDetail salesInvoiceDetail);

        Task<SalesInvoiceDetail> GetSalesInvoiceDetailBySalesInvoiceDetailId(int salesInvoiceDetailId);

        Task UpdateSalesInvoiceDetail(int salesInvoiceDetailId, SalesInvoiceDetail salesInvoiceDetail);

        Task DeleteSalesInvoiceDetail(int salesInvoiceDetailId);
    }
}
