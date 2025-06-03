using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using SriLankanParadise.ERP.UserManagement.Utilities;
using System.Security.Claims;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Middlewares
{
    public class AuditMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<AuditMiddleware> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditMiddleware(RequestDelegate next, ILogger<AuditMiddleware> logger, IHttpContextAccessor httpContextAccessor)
        {
            _next = next;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task InvokeAsync(HttpContext context, IAuditLogService auditLogService)
        {
            var user = context.User;
            var path = context.Request.Path.ToString();
            var sessionIdClaim = context.User.FindFirst("sessionId");
            var sessionId = sessionIdClaim?.Value ?? Guid.NewGuid().ToString();

            if (AuditLogExclusions.IsExcluded(path, context.Request.Method))
            {
                await _next(context);
                return;
            }

            if (user?.Identity != null && user.Identity.IsAuthenticated)
            {
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
                var ipAddress = context.Request.Headers.ContainsKey("X-Forwarded-For")
                    ? context.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                    : context.Connection.RemoteIpAddress?.ToString();

                _logger.LogInformation($"UserId claim: {userIdClaim?.Value}");
                _logger.LogInformation($"IP Address: {ipAddress}");

                if (userIdClaim != null)
                {
                    var description = AuditLogDescriptions.GetDescription(path, context.Request.Method);

                    var auditLog = new AuditLog
                    {
                        UserId = int.Parse(userIdClaim.Value),
                        SessionId = Guid.Parse(sessionId),
                        AccessedPath = path,
                        AccessedMethod = context.Request.Method,
                        Timestamp = DateTime.UtcNow,
                        Ipaddress = ipAddress ?? "Unknown",
                        Description = description
                    };

                    try
                    {
                        await auditLogService.CreateAuditLog(auditLog);
                        _logger.LogInformation("Audit log created successfully.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to create audit log.");
                    }
                }
            }
            else
            {
                _logger.LogInformation("User not authenticated or no claims found.");
            }

            await _next(context);
        }
    }


}
