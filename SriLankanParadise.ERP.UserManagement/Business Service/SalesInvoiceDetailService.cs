using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesInvoiceDetailService : ISalesInvoiceDetailService
    {
        private readonly ISalesInvoiceDetailRepository _salesInvoiceDetailRepository;
        public SalesInvoiceDetailService(ISalesInvoiceDetailRepository salesInvoiceDetailRepository)
        {
            _salesInvoiceDetailRepository = salesInvoiceDetailRepository;
        }

        public async Task AddSalesInvoiceDetail(SalesInvoiceDetail salesInvoiceDetail)
        {
            await _salesInvoiceDetailRepository.AddSalesInvoiceDetail(salesInvoiceDetail);
        }

        public async Task<SalesInvoiceDetail> GetSalesInvoiceDetailBySalesInvoiceDetailId(int salesInvoiceDetailId)
        {
            return await _salesInvoiceDetailRepository.GetSalesInvoiceDetailBySalesInvoiceDetailId(salesInvoiceDetailId);
        }

        public async Task UpdateSalesInvoiceDetail(int salesInvoiceDetailId, SalesInvoiceDetail salesInvoiceDetail)
        {
            await _salesInvoiceDetailRepository.UpdateSalesInvoiceDetail(salesInvoiceDetailId, salesInvoiceDetail);
        }

        public async Task DeleteSalesInvoiceDetail(int salesInvoiceDetailId)
        {
            await _salesInvoiceDetailRepository.DeleteSalesInvoiceDetail(salesInvoiceDetailId);
        }
    }
}
