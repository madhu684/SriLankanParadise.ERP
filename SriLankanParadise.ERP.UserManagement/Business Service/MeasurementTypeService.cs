using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class MeasurementTypeService : IMeasurementTypeService
    {
        private readonly IMeasurementTypeRepository _measurementTypeRepository;
        public MeasurementTypeService(IMeasurementTypeRepository measurementTypeRepository)
        {
            _measurementTypeRepository = measurementTypeRepository;
        }

        public async Task AddMeasurementType(MeasurementType measurementType)
        {
            await _measurementTypeRepository.AddMeasurementType(measurementType);
        }

        public async Task<IEnumerable<MeasurementType>> GetAll()
        {
            return await _measurementTypeRepository.GetAll();
        }

        public async Task<IEnumerable<MeasurementType>> GetMeasurementTypesByCompanyId(int companyId)
        {
            return await _measurementTypeRepository.GetMeasurementTypesByCompanyId(companyId);
        }

        public async Task<IEnumerable<MeasurementType>> GetAllMeasurementTypesByCompanyId(int companyId)
        {
            return await _measurementTypeRepository.GetAllMeasurementTypesByCompanyId(companyId);
        }
    }
}
