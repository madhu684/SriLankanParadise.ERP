using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class AuditLogService : IAuditLogService
    {
        private readonly IAuditLogRepository _auditLogRepository;

        public AuditLogService(IAuditLogRepository auditLogRepository)
        {
            _auditLogRepository = auditLogRepository;
        }

        public async Task CreateAuditLog(AuditLog auditLog)
        {
            await _auditLogRepository.CreateAuditLog(auditLog);
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogByDate(DateTime fromDate, DateTime toDate)
        {
            return await _auditLogRepository.GetAuditLogByDate(fromDate, toDate);
        }
    }
}
