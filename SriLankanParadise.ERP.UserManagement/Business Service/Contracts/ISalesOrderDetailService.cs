using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesOrderDetailService
    {
        Task AddSalesOrderDetail(SalesOrderDetail salesOrderDetail);

        Task<SalesOrderDetail> GetSalesOrderDetailBySalesOrderDetailId(int salesOrderDetailId);

        Task UpdateSalesOrderDetail(int salesOrderDetailId, SalesOrderDetail salesOrderDetail);

        Task DeleteSalesOrderDetail(int salesOrderDetailId);

        Task<IEnumerable<SalesOrderDetail>> GetSalesOrderDetailsBySalesOrderId(int salesOrderId);
    }
}
