﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesOrderService
    {
        Task AddSalesOrder(SalesOrder salesOrder);

        Task<IEnumerable<SalesOrder>> GetAll();

        Task<IEnumerable<SalesOrder>> GetSalesOrdersWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<SalesOrder>> GetSalesOrdersByUserId(int userId);

        Task ApproveSalesOrder(int salesOrderId, SalesOrder salesOrder);

        Task<SalesOrder> GetSalesOrderBySalesOrderId(int salesOrderId);

        Task UpdateSalesOrder(int salesOrderId, SalesOrder salesOrder);
    }
}