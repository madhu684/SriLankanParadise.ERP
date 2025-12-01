using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IRegionService
    {
        Task<IEnumerable<Region>> GetAll();
        Task<Region?> GetById(int id);
    }
}
