using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class UnitRepository : IUnitRepository
    {
        private readonly ErpSystemContext _dbContext;

        public UnitRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddUnit(Unit unit)
        {
            try
            {
                _dbContext.Units.Add(unit);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Unit>> GetAll()
        {
            try
            {
                return await _dbContext.Units.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<Unit>> GetUnitsByCompanyId(int companyId)
        {
            try
            {
                var units = await _dbContext.Units
                    .Where(u => u.Status == true && u.CompanyId == companyId)
                    .ToListAsync();

                return units.Any() ? units : null;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
