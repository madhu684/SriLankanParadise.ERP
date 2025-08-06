using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class MeasurementTypeRepository : IMeasurementTypeRepository
    {
        private readonly ErpSystemContext _dbContext;

        public MeasurementTypeRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddMeasurementType(MeasurementType measurementType)
        {
            try
            {
                _dbContext.MeasurementTypes.Add(measurementType);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<MeasurementType>> GetAll()
        {
            try
            {
                return await _dbContext.MeasurementTypes.ToListAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }


        public async Task<IEnumerable<MeasurementType>> GetMeasurementTypesByCompanyId(int companyId)
        {
            try
            {
                var measurementTypes = await _dbContext.MeasurementTypes
                    .Where(mt => mt.Status == true && mt.CompanyId == companyId)
                    .ToListAsync();

                return measurementTypes.Any() ? measurementTypes : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<MeasurementType>> GetAllMeasurementTypesByCompanyId(int companyId)
        {
            try
            {
                var measurementTypes = await _dbContext.MeasurementTypes
                    .Where(mt => mt.CompanyId == companyId)
                    .ToListAsync();

                return measurementTypes.Any() ? measurementTypes : null;
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
