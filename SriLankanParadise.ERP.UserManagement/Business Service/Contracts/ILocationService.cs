using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILocationService
    {
        Task<IEnumerable<Location>> GetLocationsByCompanyId(int companyId);

        Task AddLocation(Location location);

        Task<Location> GetLocationByLocationId(int locationId);

        Task UpdateLocation(int locationId, Location location);

        Task<IEnumerable<Location>> GetLocationsByLocationIds(int[] locationIds);
    }
}
