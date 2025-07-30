using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Middlewares
{
    public class AuditMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AuditMiddleware> _logger;

        public AuditMiddleware(RequestDelegate next, IHttpContextAccessor httpContextAccessor, ILogger<AuditMiddleware> logger)
        {
            _next = next;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                var userId = context.User.Identity?.Name;
                var requestPath = context.Request.Path;
                var method = context.Request.Method;
                var ipAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
                var timestamp = DateTime.UtcNow;

                if (userId != null)
                {
                    var logEntry = new AuditLog
                    {
                        UserId = Int32.Parse(userId),
                        AccessedPath = requestPath,
                        AccessedMethod = method,
                        Timestamp = timestamp,
                        Ipaddress = ipAddress != null ? ipAddress : "",
                        // Additional details as needed
                    };

                    // Access the scoped services using HttpContext.RequestServices
                    using var scope = context.RequestServices.CreateScope(); // Create a new scope

                    // Resolve your scoped service (ErpSystemContext) within the scope
                    var dbContext = scope.ServiceProvider.GetRequiredService<ErpSystemContext>();


                    dbContext.AuditLogs.Add(logEntry);
                    await dbContext.SaveChangesAsync();
                }
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                throw;
            }
        }
    }

}
