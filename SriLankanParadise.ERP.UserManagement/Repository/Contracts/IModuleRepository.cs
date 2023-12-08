using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IModuleRepository
    {
        Task<Module> GetModuleByModuleId(int moduleId);

        Task<IEnumerable<Module>> GetModulesByUserId(int userId);
        Task<IEnumerable<Module>> GetAll();
        Task AddModule(Module module);
        Task DeleteModule(int moduleId);
        Task UpdateModule(int moduleId, Module module);
    }
}
