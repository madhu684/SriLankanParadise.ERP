using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesOrderDetailService : ISalesOrderDetailService
    {
        private readonly ISalesOrderDetailRepository _salesOrderDetailRepository;
        public SalesOrderDetailService(ISalesOrderDetailRepository salesOrderDetailRepository)
        {
            _salesOrderDetailRepository = salesOrderDetailRepository;
        }

        public async Task AddSalesOrderDetail(SalesOrderDetail salesOrderDetail)
        {
            await _salesOrderDetailRepository.AddSalesOrderDetail(salesOrderDetail);
        }

        public async Task<SalesOrderDetail> GetSalesOrderDetailBySalesOrderDetailId(int salesOrderDetailId)
        {
            return await _salesOrderDetailRepository.GetSalesOrderDetailBySalesOrderDetailId(salesOrderDetailId);
        }

        public async Task UpdateSalesOrderDetail(int salesOrderDetailId, SalesOrderDetail salesOrderDetail)
        {
            await _salesOrderDetailRepository.UpdateSalesOrderDetail(salesOrderDetailId, salesOrderDetail);
        }

        public async Task DeleteSalesOrderDetail(int salesOrderDetailId)
        {
            await _salesOrderDetailRepository.DeleteSalesOrderDetail(salesOrderDetailId);
        }

        public async Task<IEnumerable<SalesOrderDetail>> GetSalesOrderDetailsBySalesOrderId(int salesOrderId)
        {
            return await _salesOrderDetailRepository.GetSalesOrderDetailsBySalesOrderId(salesOrderId);
        }
    }
}
