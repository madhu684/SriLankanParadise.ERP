using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IAuditLogRepository
    {
        Task CreateAuditLog(AuditLog auditLog);
        Task<IEnumerable<AuditLog>> GetAuditLogByDate(DateTime date);
    }
}
