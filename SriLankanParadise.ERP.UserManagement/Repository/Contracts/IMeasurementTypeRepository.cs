using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IMeasurementTypeRepository
    {
        Task AddMeasurementType(MeasurementType measurementType);

        Task<IEnumerable<MeasurementType>> GetAll();

        Task<IEnumerable<MeasurementType>> GetMeasurementTypesByCompanyId(int companyId);

        Task<IEnumerable<MeasurementType>> GetAllMeasurementTypesByCompanyId(int companyId);
    }
}
