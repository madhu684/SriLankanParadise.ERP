using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ModuleService : IModuleService
    {
        private readonly IModuleRepository _moduleRepository;
        public ModuleService(IModuleRepository moduleRepository)
        {
            _moduleRepository = moduleRepository;
        }

        public async Task AddModule(Module module)
        {
            await _moduleRepository.AddModule(module);
        }

        public async Task DeleteModule(int moduleId)
        {
            await _moduleRepository.DeleteModule(moduleId);
        }

        public async Task<IEnumerable<Module>> GetAll()
        {
            return await _moduleRepository.GetAll();
        }

        public async Task<Module> GetModuleByModuleId(int moduleId)
        {
            return await _moduleRepository.GetModuleByModuleId(moduleId);
        }

        public async Task UpdateModule(int moduleId, Module module)
        {
            await _moduleRepository.UpdateModule(moduleId, module);
        }

        public async Task<IEnumerable<ModuleWithIdDto>> GetModulesByUserId(int userId)
        {
            return await _moduleRepository.GetModulesByUserId(userId);
        }
    }
}
