using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PackingSlipDetailRepository : IPackingSlipDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PackingSlipDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddPackingSlipDetail(PackingSlipDetail packingSlipDetail)
        {
            try
            {
                _dbContext.PackingSlipDetails.Add(packingSlipDetail);
                await _dbContext.SaveChangesAsync();
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task DeletePackingSlipDetail(int packingSlipDetailId)
        {
            try
            {
                var packingSlipDetail = await _dbContext.PackingSlipDetails.FindAsync(packingSlipDetailId);

                if (packingSlipDetail != null)
                {
                    _dbContext.PackingSlipDetails.Remove(packingSlipDetail);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<PackingSlipDetail> GetPackingSlipDetailByPackingSlipDetailId(int packingSlipDetailId)
        {
            try
            {
                var packingSlipDetail = await _dbContext.PackingSlipDetails
                    .Where(ps => ps.PackingSlipDetailId == packingSlipDetailId)
                    .FirstOrDefaultAsync();

                return packingSlipDetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<PackingSlipDetail>> GetPackingSlipDetailsByPackingSlipId(int packingSlipId)
        {
            try
            {
                var packingSlipDetails = await _dbContext.PackingSlipDetails
                    .Where(psd => psd.PackingSlipId == packingSlipId)
                    .Include(psd => psd.ItemBatch)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ToListAsync();

                return packingSlipDetails;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task UpdatePackingSlipDetail(int packingSlipDetailId, PackingSlipDetail packingSlipDetail)
        {
            try
            {
                var existPackingSlipDetail = await _dbContext.PackingSlipDetails.FindAsync(packingSlipDetailId);

                if (existPackingSlipDetail != null)
                {
                    _dbContext.Entry(existPackingSlipDetail).CurrentValues.SetValues(packingSlipDetail);
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