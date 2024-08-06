using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
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
    }
}
