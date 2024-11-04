using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class LocationInventoryMovementRepository : ILocationInventoryMovementRepository
    {
        private readonly ErpSystemContext _dbContext;

        public LocationInventoryMovementRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddLocationInventoryMovement(LocationInventoryMovement locationInventoryMovement)
        {
            try
            {
                _dbContext.LocationInventoryMovements.Add(locationInventoryMovement);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<LocationInventoryMovement>> GetAll()
        {
            try
            {
                return await _dbContext.LocationInventoryMovements.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
        
        public async Task<IEnumerable<LocationInventoryMovement>> Get(int IssueMasterId)
        {
            try
            {
                return await _dbContext.LocationInventoryMovements
                    .Where(l => l.ReferenceNo == IssueMasterId)
                    .Where(l => l.TransactionTypeId == 4)
                    .Where(l => l.MovementTypeId == 1)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<LocationInventoryMovement>> Get(int itemMasterId, int referenceNo, int movementTypeId)
        {
            try
            {
                return await _dbContext.LocationInventoryMovements
                    .Where(l => l.ItemMasterId == itemMasterId)
                    .Where(l => l.ReferenceNo == referenceNo)
                    .Where(l => l.MovementTypeId == movementTypeId)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<LocationInventoryMovement>> ByWorkOrder(int workOrderId)
        {
            try
            {
                return await _dbContext.LocationInventoryMovements
                    .Where(l => l.ReferenceNo == workOrderId)
                    .Where(l => l.TransactionTypeId == 7)
                    .Where(l => l.MovementTypeId == 1)
                    .ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
        
        public async Task<IEnumerable<LocationInventoryMovement>> ByDateRange(DateTime fromDate, DateTime toDate)
        {
            try
            {
                var query = await _dbContext.LocationInventoryMovements
                            .Where(l => l.Date.HasValue && l.Date.Value.Date >= fromDate.Date && l.Date.Value.Date <= toDate.Date)
                            .Where(l => l.Location.LocationTypeId == 2)
                            .Where(l => l.TransactionTypeId == 4 || l.TransactionTypeId == 8)
                            .GroupBy(l => new { l.ItemMasterId, l.TransactionTypeId, l.BatchNo, l.LocationId })
                            .Select(g => new LocationInventoryMovement
                            {
                                ItemMasterId = g.Key.ItemMasterId,
                                TransactionTypeId = g.Key.TransactionTypeId,
                                BatchNo = g.Key.BatchNo,
                                LocationId = g.Key.LocationId,
                                Qty = g.Sum(x => x.Qty) // Sum the quantities
                            })
                            .ToListAsync();

                return query;
            }
            catch (Exception)
            {

                throw;
            }
        }
        
        public async Task<IEnumerable<LocationInventoryMovement>> ByDateRange(DateTime fromDate, DateTime toDate, int movementTypeId)
        {
            try
            {
                var query = await _dbContext.LocationInventoryMovements
                            .Where(l => l.Date.HasValue && l.Date.Value.Date >= fromDate.Date && l.Date.Value.Date <= toDate.Date)
                            .Where(l => l.MovementTypeId == movementTypeId)
                            .GroupBy(l => new { l.ItemMasterId, l.TransactionTypeId, l.BatchNo, l.LocationId })
                            .Select(g => new LocationInventoryMovement
                            {
                                ItemMasterId = g.Key.ItemMasterId,
                                TransactionTypeId = g.Key.TransactionTypeId,
                                BatchNo = g.Key.BatchNo,
                                LocationId = g.Key.LocationId,
                                Qty = g.Sum(x => x.Qty) // Sum the quantities
                            })
                            .ToListAsync();

                return query;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<LocationInventoryMovement> GetLocationInventoryMovementByLocationInventoryMovementId(int locationInventoryMovementId)
        {
            try
            {
                var locationInventory = await _dbContext.LocationInventoryMovements
                    .Where(lim => lim.LocationInventoryMovementId == locationInventoryMovementId)
                    .FirstOrDefaultAsync();

                return locationInventory;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateLocationInventoryMovement(int locationInventoryMovementId, LocationInventoryMovement locationInventoryMovement)
        {
            try
            {
                var existUserLocationInventoryMovement = await _dbContext.LocationInventoryMovements.FindAsync(locationInventoryMovementId);

                if (existUserLocationInventoryMovement != null)
                {
                    _dbContext.Entry(existUserLocationInventoryMovement).CurrentValues.SetValues(locationInventoryMovement);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<LocationInventoryMovement> Get(int movementTypeId, int itemMasterId, string batchNo)
        {
            try
            {
                var locationInventoryMovement = await _dbContext.LocationInventoryMovements
                    .Where(l => l.MovementTypeId == movementTypeId)
                    .Where(l => l.ItemMasterId == itemMasterId)
                    .Where(l => l.BatchNo == batchNo)
                    .FirstOrDefaultAsync();

                if(locationInventoryMovement != null)
                {
                    return locationInventoryMovement;
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
