using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PurchaseRequisitionRepository : IPurchaseRequisitionRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PurchaseRequisitionRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddPurchaseRequisition(PurchaseRequisition purchaseRequisition)
        {
            try
            {
                _dbContext.PurchaseRequisitions.Add(purchaseRequisition);
                 await _dbContext.SaveChangesAsync();
                
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetAll()
        {
            try
            {
                return await _dbContext.PurchaseRequisitions
                    .Include(pr => pr.PurchaseRequisitionDetails)
                    .ThenInclude(prd => prd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(pr => pr.Supplier)
                    .Include(pr => pr.ExpectedDeliveryLocationNavigation).ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetPurchaseRequisitionsWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var purchaseRequisitions = await _dbContext.PurchaseRequisitions
                    .Where(pr => pr.Status != 0 && pr.CompanyId == companyId)
                    .Include(pr => pr.PurchaseRequisitionDetails)
                    .ThenInclude(prd =>prd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(pr => pr.ExpectedDeliveryLocationNavigation)
                    .Include(pr => pr.DepartmentNavigation)
                    .Include(pr => pr.Supplier)
                    .ToListAsync();

                if (purchaseRequisitions.Any())
                {
                    return purchaseRequisitions;
                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task ApprovePurchaseRequisition(int purchaseRequisitionId, PurchaseRequisition purchaseRequisition)
        {
            try
            {
                var existPurchaseRequisition = await _dbContext.PurchaseRequisitions.FindAsync(purchaseRequisitionId);

                if (existPurchaseRequisition!= null)
                {
                    existPurchaseRequisition.Status = purchaseRequisition.Status;
                    existPurchaseRequisition.ApprovedBy = purchaseRequisition.ApprovedBy;
                    existPurchaseRequisition.ApprovedUserId = purchaseRequisition.ApprovedUserId;
                    existPurchaseRequisition.ApprovedDate = purchaseRequisition.ApprovedDate;

                    /*_dbContext.Entry(existPurchaseRequisition).CurrentValues.SetValues(purchaseRequisition);*/
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<PurchaseRequisition> GetPurchaseRequisitionByPurchaseRequisitionId(int purchaseRequisitionId)
        {
            try
            {
                var purchaseRequisition = await _dbContext.PurchaseRequisitions
                    .Where(pr => pr.PurchaseRequisitionId == purchaseRequisitionId)
                    .Include(pr => pr.PurchaseRequisitionDetails)
                    .ThenInclude(prd => prd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(pr => pr.ExpectedDeliveryLocationNavigation)
                    .Include(pr => pr.DepartmentNavigation)
                    .Include(pr => pr.Supplier)
                    .FirstOrDefaultAsync();

                return purchaseRequisition;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetPurchaseRequisitionsByUserId(int userId)
        {
            try
            {


                var purchaseRequisitions = await _dbContext.PurchaseRequisitions
                    .Where(pr => pr.RequestedUserId == userId)
                    .Include(pr => pr.PurchaseRequisitionDetails)
                    .ThenInclude(prd => prd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(pr => pr.ExpectedDeliveryLocationNavigation)
                    .Include(pr => pr.DepartmentNavigation)
                    .Include(pr => pr.Supplier)
                    .ToListAsync();

                

                if (purchaseRequisitions.Any())
                {
                    return purchaseRequisitions;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdatePurchaseRequisition(int purchaseRequisitionId, PurchaseRequisition purchaseRequisition)
        {
            try
            {
                var existPurchaseRequisition = await _dbContext.PurchaseRequisitions.FindAsync(purchaseRequisitionId);

                if (existPurchaseRequisition != null)
                {
                    _dbContext.Entry(existPurchaseRequisition).CurrentValues.SetValues(purchaseRequisition);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeletePurchaseOrder(int purchaseRequisitionId)
        {
            try
            {
                var purchaseRequisition = await _dbContext.PurchaseRequisitions.FirstOrDefaultAsync(pr => pr.PurchaseRequisitionId == purchaseRequisitionId);

                if (purchaseRequisition == null)
                {
                    throw new KeyNotFoundException($"Purchase order with ID {purchaseRequisitionId} not found");
                }

                var strategy = _dbContext.Database.CreateExecutionStrategy();

                await strategy.ExecuteAsync(async () =>
                {
                    using var transaction = await _dbContext.Database.BeginTransactionAsync();

                    try
                    {
                        var purchaseRequisitionDetails = await _dbContext.PurchaseRequisitionDetails
                            .Where(pod => pod.PurchaseRequisitionId == purchaseRequisitionId)
                            .ToListAsync();

                        if (purchaseRequisitionDetails.Any())
                        {
                            _dbContext.PurchaseRequisitionDetails.RemoveRange(purchaseRequisitionDetails);
                        }

                        _dbContext.PurchaseRequisitions.Remove(purchaseRequisition);

                        await _dbContext.SaveChangesAsync();

                        await transaction.CommitAsync();
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        throw new Exception($"Error deleting purchase order with ID {purchaseRequisitionId}", ex);
                    }
                });
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<PagedResult<PurchaseRequisition>> GetPaginatedPurchaseRequisitionsWithoutDraftsByCompanyId(
            int companyId,
            int pageNumber,
            int pageSize)
        {
            try
            {
                // Input validation
                if (pageNumber < 1) pageNumber = 1;
                if (pageSize < 1) pageSize = 10;
                if (pageSize > 100) pageSize = 100;

                var query = _dbContext.PurchaseRequisitions
                    .Where(pr => pr.Status != 0 && pr.CompanyId == companyId)
                    .Include(pr => pr.PurchaseRequisitionDetails)
                    .ThenInclude(prd => prd.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(pr => pr.ExpectedDeliveryLocationNavigation)
                    .Include(pr => pr.DepartmentNavigation)
                    .Include(pr => pr.Supplier);

                var totalCount = await query.CountAsync();

                // Apply pagination and ordering
                // Ordering by RequisitionDate descending seems appropriate for a list
                var items = await query
                    .OrderByDescending(pr => pr.RequisitionDate)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new PagedResult<PurchaseRequisition>
                {
                    Items = items,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
