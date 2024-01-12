using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ILocationRepository
    {
        Task<IEnumerable<Location>> GetLocationsByCompanyId(int companyId);
    }
}
