using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SubModuleService : ISubModuleService
    {
        private readonly ISubModuleRepository _subModuleRepository;
        public SubModuleService(ISubModuleRepository submoduleRepository)
        {
            _subModuleRepository = submoduleRepository;
        }
        public async Task<IEnumerable<SubModule>> GetSubModulesByModuleId(int moduleId)
        {
            return await _subModuleRepository.GetSubModulesByModuleId(moduleId);
        }

        public async Task AddSubModule(SubModule subModule)
        {
            await _subModuleRepository.AddSubModule(subModule);
        }
    }
}
