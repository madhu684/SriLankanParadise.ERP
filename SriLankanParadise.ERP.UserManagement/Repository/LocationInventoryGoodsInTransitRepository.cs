using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class LocationInventoryGoodsInTransitRepository : ILocationInventoryGoodsInTransitRepository
    {
        private readonly ErpSystemContext _dbContext;

        public LocationInventoryGoodsInTransitRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddLocationInventoryGoodsInTransit(LocationInventoryGoodsInTransit locationInventoryGoodsInTransit)
        {
            try
            {
                _dbContext.LocationInventoryGoodsInTransits.Add(locationInventoryGoodsInTransit);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<LocationInventoryGoodsInTransit>> GetAll()
        {
            try
            {
                return await _dbContext.LocationInventoryGoodsInTransits.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<LocationInventoryGoodsInTransit> GetLocationInventoryGoodsInTransitByLocationInventoryGoodsInTransitId(int locationInventoryGoodsInTransitId)
        {
            try
            {
                var locationInventoryGoodsInTransit = await _dbContext.LocationInventoryGoodsInTransits
                    .Where(ligt => ligt.LocationInventoryGoodsInTransitId == locationInventoryGoodsInTransitId)
                    .FirstOrDefaultAsync();

                return locationInventoryGoodsInTransit;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateLocationInventoryGoodsInTransit(int locationInventoryGoodsInTransitId, LocationInventoryGoodsInTransit locationInventoryGoodsInTransit)
        {
            try
            {
                var existUserLocationInventoryGoodsInTransit = await _dbContext.LocationInventoryGoodsInTransits.FindAsync(locationInventoryGoodsInTransitId);

                if (existUserLocationInventoryGoodsInTransit != null)
                {
                    _dbContext.Entry(existUserLocationInventoryGoodsInTransit).CurrentValues.SetValues(locationInventoryGoodsInTransit);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<LocationInventoryGoodsInTransit> GetLocationInventoryGoodsInTransitByDetails(int toLocationId, int fromLocationId, int itemMasterId, int batchId)
        {
            try
            {
                var locationInventoryGoodsInTransit = await _dbContext.LocationInventoryGoodsInTransits
                    .Where(ligt => ligt.ToLocationId == toLocationId && ligt.FromLocationId == fromLocationId && ligt.ItemMasterId == itemMasterId && ligt.BatchId == batchId)
                    .FirstOrDefaultAsync();

                return locationInventoryGoodsInTransit;

            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task UpdateLocationInventoryGoodsInTransitStatus(int toLocationId, int fromLocationId, int itemMasterId, int batchId, LocationInventoryGoodsInTransit locationInventoryGoodsInTransit)
        {
            try
            {
                var existLocationInventoryGoodsInTransit = await _dbContext.LocationInventoryGoodsInTransits.Where(ligt => ligt.ToLocationId == toLocationId && ligt.FromLocationId == fromLocationId && ligt.ItemMasterId == itemMasterId && ligt.BatchId == batchId).FirstOrDefaultAsync();

                if (existLocationInventoryGoodsInTransit != null)
                {

                    existLocationInventoryGoodsInTransit.Status = locationInventoryGoodsInTransit.Status;
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
