using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ActionLogRepository : IActionLogRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ActionLogRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task CreateActionLog(ActionLog actionLog)
        {
            try
            {
                _dbContext.ActionLogs.Add(actionLog);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
