﻿using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
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
                    .Include(pr => pr.DeliveryLocationNavigation).ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PurchaseRequisition>> GetPurchaseRequisitionsWithoutDrafts()
        {
            try
            {
                return await _dbContext.PurchaseRequisitions
                    .Where(pr => pr.Status != 0)
                    .Include(pr => pr.PurchaseRequisitionDetails)
                    .Include(pr => pr.DeliveryLocationNavigation)
                    .ToListAsync();
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
                    .Include(pr => pr.DeliveryLocationNavigation)
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
                    .Include(pr => pr.DeliveryLocationNavigation)
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
    }
}