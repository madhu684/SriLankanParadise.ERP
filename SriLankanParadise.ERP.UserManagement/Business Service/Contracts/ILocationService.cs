using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationService
    {
        Task<IEnumerable<Location>> GetLocationsByCompanyId(int companyId);
    }
}
