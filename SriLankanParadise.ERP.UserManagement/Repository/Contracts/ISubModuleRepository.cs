using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISubModuleRepository
    {
        Task<IEnumerable<SubModule>> GetSubModulesByModuleId(int moduleId);
        Task AddSubModule(SubModule subModule);
    }
}
