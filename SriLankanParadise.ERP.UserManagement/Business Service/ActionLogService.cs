using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ActionLogService : IActionLogService
    {
        private readonly IActionLogRepository _actionLogRepository;

        public ActionLogService(IActionLogRepository actionLogRepository)
        {
            _actionLogRepository = actionLogRepository;
        }
        public async Task CreateActionLog(ActionLog actionLog)
        {
            await _actionLogRepository.CreateActionLog(actionLog);
        }
    }
}
