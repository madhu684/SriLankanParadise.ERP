using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IMeasurementTypeService
    {
        Task AddMeasurementType(MeasurementType measurementType);

        Task<IEnumerable<MeasurementType>> GetAll();

        Task<IEnumerable<MeasurementType>> GetMeasurementTypesByCompanyId(int companyId);

        Task<IEnumerable<MeasurementType>> GetAllMeasurementTypesByCompanyId(int companyId);
    }
}
