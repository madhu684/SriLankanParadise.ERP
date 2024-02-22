using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesOrderDetailRepository
    {
        Task AddSalesOrderDetail(SalesOrderDetail salesOrderDetail);

        Task<SalesOrderDetail> GetSalesOrderDetailBySalesOrderDetailId(int salesOrderDetailId);

        Task UpdateSalesOrderDetail(int salesOrderDetailId, SalesOrderDetail salesOrderDetail);

        Task DeleteSalesOrderDetail(int salesOrderDetailId);
    }
}
