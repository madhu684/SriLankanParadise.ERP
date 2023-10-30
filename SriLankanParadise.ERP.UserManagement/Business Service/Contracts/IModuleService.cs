using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IModuleService
    {
        Task<Module> GetModuleByModuleId(int moduleId);
        Task<IEnumerable<Module>> GetAll();
        Task AddModule(Module module);
        Task DeleteModule(int moduleId);
        Task UpdateModule(int moduleId, Module module);
    }
}
