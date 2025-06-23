using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IModuleService
    {
        Task<Module> GetModuleByModuleId(int moduleId);
        Task<IEnumerable<ModuleWithIdDto>> GetModulesByUserId(int userId);
        Task<IEnumerable<Module>> GetAll();
        Task AddModule(Module module);
        Task DeleteModule(int moduleId);
        Task UpdateModule(int moduleId, Module module);
    }
}
