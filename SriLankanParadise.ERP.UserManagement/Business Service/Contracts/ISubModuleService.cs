using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISubModuleService
    {
        Task<IEnumerable<SubModule>> GetSubModulesByModuleId(int moduleId);

        Task AddSubModule(SubModule submodule);
    }
}
