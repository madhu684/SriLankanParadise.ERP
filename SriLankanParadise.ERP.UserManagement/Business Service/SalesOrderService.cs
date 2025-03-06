using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _salesOrderRepository;
        public SalesOrderService(ISalesOrderRepository salesOrderRepository)
        {
            _salesOrderRepository = salesOrderRepository;
        }

        public async Task AddSalesOrder(SalesOrder salesOrder)
        {
            await _salesOrderRepository.AddSalesOrder(salesOrder);
        }

        public async Task<IEnumerable<SalesOrder>> GetAll()
        {
            return await _salesOrderRepository.GetAll();
        }

        public async Task<IEnumerable<SalesOrder>> GetSalesOrdersWithoutDraftsByCompanyId(int companyId)
        {
            return await _salesOrderRepository.GetSalesOrdersWithoutDraftsByCompanyId(companyId);
        }

        public async Task<IEnumerable<SalesOrder>> GetSalesOrdersByUserId(int userId)
        {
            return await _salesOrderRepository.GetSalesOrdersByUserId(userId);
        }

        public async Task ApproveSalesOrder(int salesOrderId, SalesOrder salesOrder)
        {
            await _salesOrderRepository.ApproveSalesOrder(salesOrderId, salesOrder);
        }

        public async Task<SalesOrder> GetSalesOrderBySalesOrderId(int salesOrderId)
        {
            return await _salesOrderRepository.GetSalesOrderBySalesOrderId(salesOrderId);
        }

        public async Task UpdateSalesOrder(int salesOrderId, SalesOrder salesOrder)
        {
            await _salesOrderRepository.UpdateSalesOrder(salesOrderId, salesOrder);
        }

        public async Task<IEnumerable<SalesOrder>> GetSalesOrderDetailsByOrderDateRange(DateTime fromDate, DateTime toDate)
        {
            return await _salesOrderRepository.GetSalesOrderDetailsByOrderDateRange(fromDate, toDate);
        }

        public async Task<int> GetSalesOrderCountPerDateRange(DateTime fromDate, DateTime toDate)
        {
            return await _salesOrderRepository.GetSalesOrderCountPerDateRange(fromDate, toDate);
        }
    }
}
