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
        
        public async Task<IEnumerable<LocationInventoryMovementExtended>> ByDateRange(DateTime fromDate, DateTime toDate, int movementTypeId)
        {
            try
            {
                var query = await _dbContext.LocationInventoryMovements
                            .Where(l => l.Date.HasValue && l.Date.Value.Date >= fromDate.Date && l.Date.Value.Date <= toDate.Date)
                            .Where(l => l.MovementTypeId == movementTypeId)
                            .GroupBy(l => new { l.ItemMasterId, l.TransactionTypeId, l.BatchNo, l.LocationId })
                            .Select(g => new LocationInventoryMovementExtended
                            {
                                ItemMasterId = g.Key.ItemMasterId,
                                TransactionTypeId = g.Key.TransactionTypeId,
                                BatchNo = g.Key.BatchNo,
                                LocationId = g.Key.LocationId,
                                Qty = g.Sum(x => x.Qty), // Sum the quantities
                                GRNQty = g.Sum(x => x.TransactionTypeId == 4 ? x.Qty : 0),
                                ProductionInQty = g.Sum(x => x.TransactionTypeId == 7 ? x.Qty : 0),
                                ReturnInQty = g.Sum(x => x.TransactionTypeId == 10 ? x.Qty : 0),
                                ProductionOutQty = g.Sum(x => x.TransactionTypeId == 8 ? x.Qty : 0),
                                ReturnQty = g.Sum(x => x.TransactionTypeId == 9 ? x.Qty : 0),
                            })
                            .ToListAsync();

                return query;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<LocationInventoryMovement>> GetOnOrBeforeSpecificDate(DateTime date, int movementTypeId, int transactionTypeId)
        {
            try
            {
                var query = await _dbContext.LocationInventoryMovements
                            .Where(l => l.Date.HasValue && l.Date.Value.Date <= date.Date)
                            .Where(l => l.MovementTypeId == movementTypeId)
                            .Where(l => l.TransactionTypeId == transactionTypeId)
                            .GroupBy(l => new { l.ItemMasterId, l.TransactionTypeId, l.BatchNo, l.LocationId })
                            .Select(g => new LocationInventoryMovement
                            {
                                ItemMasterId = g.Key.ItemMasterId,
                                TransactionTypeId = g.Key.TransactionTypeId,
                                BatchNo = g.Key.BatchNo,
                                LocationId = g.Key.LocationId,
                                Qty = g.Sum(x => x.Qty), // Sum the quantities
                            })
                            .ToListAsync();

                return query;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<LocationInventoryMovementExtended>> ByDateRange(DateTime fromDate, DateTime toDate, int locationId, int movementTypeId)
        {
            try
            {
                var query = await _dbContext.LocationInventoryMovements
                            .Where(l => l.TransactionDate.HasValue && l.TransactionDate.Value.Date >= fromDate.Date && l.TransactionDate.Value.Date <= toDate.Date)
                            .Where(l => l.MovementTypeId == movementTypeId)
                            .Where(l => l.LocationId == locationId)
                            .GroupBy(l => new { l.ItemMasterId, l.TransactionTypeId, l.BatchNo, l.LocationId })
                            .Select(g => new LocationInventoryMovementExtended
                            {
                                ItemMasterId = g.Key.ItemMasterId,
                                TransactionTypeId = g.Key.TransactionTypeId,
                                BatchNo = g.Key.BatchNo,
                                LocationId = g.Key.LocationId,
                                Qty = g.Sum(x => x.Qty), // Sum the quantities
                                GRNQty = g.Sum(x => x.TransactionTypeId == 4 ? x.Qty : 0),
                                ProductionInQty = g.Sum(x => x.TransactionTypeId == 7 ? x.Qty : 0),
                                ReturnInQty = g.Sum(x => x.TransactionTypeId == 10 ? x.Qty : 0),
                                ProductionOutQty = g.Sum(x => x.TransactionTypeId == 8 ? x.Qty : 0),
                                ReturnQty = g.Sum(x => x.TransactionTypeId == 9 ? x.Qty : 0),
                            })
                            .ToListAsync();

                return query;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<LocationInventoryMovement>> ByDateRangeAndTransactionType(DateTime fromDate, DateTime toDate, int movementTypeId, int transactionTypeId)
        {
            try
            {
                var query = await _dbContext.LocationInventoryMovements
                            .Where(l => l.TransactionDate.HasValue && l.TransactionDate.Value.Date >= fromDate.Date && l.TransactionDate.Value.Date <= toDate.Date)
                            .Where(l => l.MovementTypeId == movementTypeId)
                            .Where(l => l.TransactionTypeId == transactionTypeId)
                            .ToListAsync();

                return query;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<LocationInventoryMovement>> GetWithoutBatchNo(int movementTypeId, int transactionTypeId, int itemMasterId, int locationId, int referenceId)
        {
            try
            {
                var locationInventoryMovement = await _dbContext.LocationInventoryMovements
                    .Where(l => l.MovementTypeId == movementTypeId && l.TransactionTypeId == transactionTypeId
                    && l.ItemMasterId == itemMasterId && l.LocationId == locationId && l.ReferenceNo == referenceId)
                    .ToListAsync();

                if (locationInventoryMovement != null)
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

        public async Task<IEnumerable<LocationInventoryMovement>> GetUnique(int movementTypeId, int transactionTypeId, int itemMasterId, string batchNo, int locationId, int referenceId)
        {
            try
            {
                var locationInventoryMovement = await _dbContext.LocationInventoryMovements
                    .Where(l => l.MovementTypeId == movementTypeId && l.TransactionTypeId == transactionTypeId
                    && l.ItemMasterId == itemMasterId && l.BatchNo == batchNo && l.LocationId == locationId && l.ReferenceNo == referenceId)
                    .ToListAsync();

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

        public async Task<IEnumerable<LocationInventoryMovement>> GetWithoutReferenceNo(int movementTypeId, int transactionTypeId, int itemMasterId, string batchNo, int locationId, DateTime fromDate, DateTime toDate)
        {
            try
            {
                var locationInventoryMovement = await _dbContext.LocationInventoryMovements
                    .Where(l => l.Date.HasValue && l.Date.Value.Date >= fromDate.Date && l.Date.Value.Date <= toDate.Date)
                    .Where(l => l.MovementTypeId == movementTypeId && l.TransactionTypeId == transactionTypeId
                    && l.ItemMasterId == itemMasterId && l.BatchNo == batchNo && l.LocationId == locationId)
                    .ToListAsync();

                if (locationInventoryMovement != null)
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
