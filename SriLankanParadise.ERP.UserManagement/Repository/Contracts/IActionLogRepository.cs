using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IActionLogRepository
    {
        Task CreateActionLog(ActionLog actionLog);
    }
}
