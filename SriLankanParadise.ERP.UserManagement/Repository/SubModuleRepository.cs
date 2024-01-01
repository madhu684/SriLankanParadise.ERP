using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SubModuleRepository : ISubModuleRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SubModuleRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IEnumerable<SubModule>> GetSubModulesByModuleId(int moduleId)
        {
            try
            {
                var submodules = await _dbContext.SubModules
                    .Where(submodule => submodule.ModuleId == moduleId)
                    .ToListAsync();
                if (submodules.Any())
                {
                    return submodules;
                }
                return null;

            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task AddSubModule(SubModule subModule)
        {
            try
            {
                _dbContext.SubModules.Add(subModule);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
