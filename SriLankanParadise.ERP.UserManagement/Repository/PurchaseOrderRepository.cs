using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PurchaseOrderRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddPurchaseOrder(PurchaseOrder purchaseOrder)
        {
            try
            {
                _dbContext.PurchaseOrders.Add(purchaseOrder);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PurchaseOrder>> GetAll()
        {
            try
            {
                return await _dbContext.PurchaseOrders
                    .Include(po => po.PurchaseOrderDetails)
                    .Include(po => po.Supplier)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var purchaseOrders= await _dbContext.PurchaseOrders
                    .Where(po => po.Status != 0 && po.CompanyId == companyId)
                    .Include(po => po.PurchaseOrderDetails)
                    .ThenInclude(pod => pod.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(po => po.Supplier)
                    .ToListAsync();

                return purchaseOrders.Any() ? purchaseOrders : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersByUserId(int userId)
        {
            try
            {
                var purchaseOrders = await _dbContext.PurchaseOrders
                    .Where(po => po.OrderedUserId == userId)
                    .Include(po => po.PurchaseOrderDetails)
                    .ThenInclude(pod => pod.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(po => po.Supplier)
                    .ToListAsync();


                return purchaseOrders.Any() ? purchaseOrders : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task ApprovePurchaseOrder(int purchaseOrderId, PurchaseOrder purchaseOrder)
        {
            try
            {
                var existPurchaseOrder = await _dbContext.PurchaseOrders.FindAsync(purchaseOrderId);

                if (existPurchaseOrder != null)
                {
                    existPurchaseOrder.Status = purchaseOrder.Status;
                    existPurchaseOrder.ApprovedBy = purchaseOrder.ApprovedBy;
                    existPurchaseOrder.ApprovedUserId = purchaseOrder.ApprovedUserId;
                    existPurchaseOrder.ApprovedDate = purchaseOrder.ApprovedDate;
                    existPurchaseOrder.PurchaseRequisitionId = purchaseOrder.PurchaseRequisitionId;


                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<PurchaseOrder> GetPurchaseOrderByPurchaseOrderId(int purchaseOrderId)
        {
            try
            {
                var purchaseOrder = await _dbContext.PurchaseOrders
                    .Where(po => po.PurchaseOrderId == purchaseOrderId)
                    .Include(po => po.PurchaseOrderDetails)
                    .ThenInclude(pod => pod.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(po => po.Supplier)
                    .FirstOrDefaultAsync();

                return purchaseOrder;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdatePurchaseOrder(int purchaseOrderId, PurchaseOrder purchaseOrder)
        {
            try
            {
                var existPurchaseOrder = await _dbContext.PurchaseOrders.FindAsync(purchaseOrderId);

                if (existPurchaseOrder != null)
                {
                    _dbContext.Entry(existPurchaseOrder).CurrentValues.SetValues(purchaseOrder);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PurchaseOrder>> GetPurchaseOrdersByCompanyId(int companyId)
        {
            try
            {
                var purchaseOrders = await _dbContext.PurchaseOrders
                    .Where(po => po.CompanyId == companyId)
                    .Include(po => po.Supplier)
                    .Include(po => po.PurchaseOrderDetails)
                    .ThenInclude(pod => pod.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .ToListAsync();

                return purchaseOrders.Any() ? purchaseOrders : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeletePurchaseOrder(int purchaseOrderId)
        {
            try
            {
                var purchaseOrder = await _dbContext.PurchaseOrders.FirstOrDefaultAsync(x => x.PurchaseOrderId == purchaseOrderId);
                if (purchaseOrder == null)
                {
                    throw new KeyNotFoundException($"Purchase order with ID {purchaseOrderId} not found");
                }

                var strategy = _dbContext.Database.CreateExecutionStrategy();

                await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _dbContext.Database.BeginTransactionAsync();

                    try
                    {
                        var purchaseOrderDetails = await _dbContext.PurchaseOrderDetails
                            .Where(pod => pod.PurchaseOrderId == purchaseOrderId)
                            .ToListAsync();

                        if (purchaseOrderDetails.Any())
                        {
                            _dbContext.PurchaseOrderDetails.RemoveRange(purchaseOrderDetails);
                        }

                        _dbContext.PurchaseOrders.Remove(purchaseOrder);

                        await _dbContext.SaveChangesAsync();

                        await transaction.CommitAsync();
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        throw new Exception($"Error deleting purchase order with ID {purchaseOrderId}", ex);
                    }
                });
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
