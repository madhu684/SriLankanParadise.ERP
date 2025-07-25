using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IAuditLogService
    {
        Task CreateAuditLog(AuditLog auditLog);
        Task<IEnumerable<AuditLog>> GetAuditLogByDate(DateTime fromDate, DateTime toDate);
    }
}
