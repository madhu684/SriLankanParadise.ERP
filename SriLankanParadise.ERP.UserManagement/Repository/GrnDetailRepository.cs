using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class GrnDetailRepository : IGrnDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public GrnDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddGrnDetail(GrnDetail grnDetail)
        {
            try
            {
                _dbContext.GrnDetails.Add(grnDetail);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<GrnDetail> GetGrnDetailByGrnDetailId(int grnDetailId)
        {
            try
            {
                var grnDetail = await _dbContext.GrnDetails
                    .Where(gm => gm.GrnDetailId == grnDetailId)
                    .FirstOrDefaultAsync();

                return grnDetail;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateGrnDetail(int grnDetailId, GrnDetail grnDetail)
        {
            try
            {
                var existGrnDetail = await _dbContext.GrnDetails.FindAsync(grnDetailId);

                if (existGrnDetail != null)
                {
                    _dbContext.Entry(existGrnDetail).CurrentValues.SetValues(grnDetail);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteGrnDetail(int grnDetailId)
        {
            try
            {
                var grnDetail = await _dbContext.GrnDetails.FindAsync(grnDetailId);

                if (grnDetail != null)
                {
                    _dbContext.GrnDetails.Remove(grnDetail);
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
