using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly ErpSystemContext _dbContext;

        public AuditLogRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task CreateAuditLog(AuditLog auditLog)
        {
            try
            {
                _dbContext.AuditLogs.Add(auditLog);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<AuditLog>> GetAuditLogByDate(DateTime fromDate, DateTime toDate)
        {
            try
            {
                var log = await _dbContext.AuditLogs
                    .Where(l => EF.Functions.DateDiffDay(fromDate, l.Timestamp) >= 0
                             && EF.Functions.DateDiffDay(l.Timestamp, toDate) >= 0
                             && l.Description != "Fetch reference data")
                    .Include(l => l.User)
                    .ToListAsync();

                return log.Any() ? log : null;
            }
            catch
            {
                throw;
            }
        }
    }
}
