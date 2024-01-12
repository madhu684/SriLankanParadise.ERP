using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class GrnMasterRepository : IGrnMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public GrnMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddGrnMaster(GrnMaster grnMaster)
        {
            try
            {
                _dbContext.GrnMasters.Add(grnMaster);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<GrnMaster>> GetAll()
        {
            try
            {
                return await _dbContext.GrnMasters.Include(g => g.GrnDetails).ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
