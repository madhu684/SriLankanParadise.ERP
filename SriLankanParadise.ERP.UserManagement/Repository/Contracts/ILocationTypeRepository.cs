using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ILocationTypeRepository
    {
        Task<IEnumerable<LocationType>> GetLocationTypesByCompanyId();
    }
}
