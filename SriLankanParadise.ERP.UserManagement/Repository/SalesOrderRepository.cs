using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SalesOrderRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddSalesOrder(SalesOrder salesOrder)
        {
            try
            {
                _dbContext.SalesOrders.Add(salesOrder);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesOrder>> GetAll()
        {
            try
            {
                var salesOrders = await _dbContext.SalesOrders
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(sod => sod.Batch)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(ib => ib.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(so => so.Customer)
                        .ThenInclude(cu => cu.Region)
                    .Include(so => so.SalesPerson)
                    .ToListAsync();


                return salesOrders.Any() ? salesOrders : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesOrder>> GetSalesOrdersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var salesOrders = await _dbContext.SalesOrders
                    .Where(so => so.Status != 0 && so.CompanyId == companyId)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(ib => ib.Batch)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(im => im.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(so => so.Customer)
                        .ThenInclude(cu => cu.CustomerDeliveryAddress)
                    .Include(so => so.Customer)
                        .ThenInclude(cu => cu.Region)
                    .Include(so => so.SalesPerson)
                    .ToListAsync();

                return salesOrders.Any() ? salesOrders : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesOrder>> GetSalesOrdersByUserId(int userId)
        {
            try
            {
                var salesOrders = await _dbContext.SalesOrders
                    .Where(so => so.CreatedUserId == userId)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(ib => ib.Batch)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(im => im.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(so => so.Customer)
                        .ThenInclude(cu => cu.Region)
                    .Include(so => so.SalesPerson)
                    .ToListAsync();


                return salesOrders.Any() ? salesOrders : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task ApproveSalesOrder(int salesOrderId, SalesOrder salesOrder)
        {
            try
            {
                var existSalesOrder = await _dbContext.SalesOrders.FindAsync(salesOrderId);

                if (existSalesOrder != null)
                {
                    existSalesOrder.Status = salesOrder.Status;
                    existSalesOrder.ApprovedBy = salesOrder.ApprovedBy;
                    existSalesOrder.ApprovedUserId = salesOrder.ApprovedUserId;
                    existSalesOrder.ApprovedDate = salesOrder.ApprovedDate;

                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<SalesOrder> GetSalesOrderBySalesOrderId(int salesOrderId)
        {
            try
            {
                var salesOrder = await _dbContext.SalesOrders
                    .Where(so => so.SalesOrderId == salesOrderId)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(ib => ib.Batch)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(im => im.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(so => so.Customer)
                        .ThenInclude(cu => cu.Region)
                    .Include(so => so.SalesPerson)
                    .FirstOrDefaultAsync();

                return salesOrder;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSalesOrder(int salesOrderId, SalesOrder salesOrder)
        {
            try
            {
                var existSalesOrder = await _dbContext.SalesOrders.FindAsync(salesOrderId);

                if (existSalesOrder != null)
                {
                    _dbContext.Entry(existSalesOrder).CurrentValues.SetValues(salesOrder);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SalesOrder>> GetSalesOrderDetailsByOrderDateRange(DateTime fromDate, DateTime toDate)
        {
            try
            {
                var salesOrderMasters = await _dbContext.SalesOrders
                    .Where(so => so.OrderDate >= fromDate && so.OrderDate <= toDate)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(ib => ib.Batch)
                    .Include(so => so.SalesOrderDetails)
                        .ThenInclude(im => im.ItemMaster)
                        .ThenInclude(im => im.Unit)
                    .Include(so => so.Customer)
                    .Include(so => so.SalesPerson)
                    .ToListAsync();

                return salesOrderMasters.Any() ? salesOrderMasters : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<int> GetSalesOrderCountPerDateRange(DateTime fromDate, DateTime toDate)
        {
            return await _dbContext.SalesOrders
                .Where(so => so.OrderDate >= fromDate && so.OrderDate <= toDate)
                .CountAsync();
        }

       
    }
}
