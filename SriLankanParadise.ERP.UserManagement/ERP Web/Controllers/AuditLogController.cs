using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/audit-log")]
    public class AuditLogController : BaseApiController
    {
        private readonly IAuditLogService _auditLogService;
        private readonly ILogger<AuditLogController> _logger;
        private readonly IMapper _mapper;

        public AuditLogController(IAuditLogService auditLogService, ILogger<AuditLogController> logger, IMapper mapper)
        {
            _auditLogService = auditLogService;
            _logger = logger;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ApiResponseModel> CreateAuditLog(AuditLogRequestModel auditLogRequestModel)
        {
            try
            {
                var auditLog = _mapper.Map<AuditLog>(auditLogRequestModel);
                await _auditLogService.CreateAuditLog(auditLog);

                _logger.LogInformation(LogMessages.AuditLogCreated);
                AddResponseMessage(Response, LogMessages.AuditLogCreated, true, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [AllowAnonymous]
        [HttpGet("GetAuditLogByDate/{date}")]
        public async Task<ApiResponseModel> GetAuditLogByDate(DateTime date)
        {
            try
            {
                var auditLogs = await _auditLogService.GetAuditLogByDate(date);

                if (auditLogs == null || !auditLogs.Any())
                {
                    _logger.LogWarning(LogMessages.AuditLogNotFound);
                    return AddResponseMessage(Response, LogMessages.AuditLogNotFound, null, false, HttpStatusCode.NotFound);
                }

                // Map to DTO
                var auditLogDtos = _mapper.Map<List<AuditLogDto>>(auditLogs);

                // Group by UserId
                var grouped = auditLogDtos
                    .GroupBy(l => l.UserId)
                    .Select(group => new UserAuditLogGroupDto
                    {
                        UserId = group.Key,
                        Sessions = group.OrderBy(x => x.Timestamp).ToList()
                    })
                    .ToList();

                var response = new GroupedAuditLogResponse
                {
                    UserCount = grouped.Count,
                    Result = grouped
                };

                _logger.LogInformation(LogMessages.AuditLogRetrieved);
                return AddResponseMessage(Response, LogMessages.AuditLogRetrieved, response, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }


    public class GroupedAuditLogResponse
    {
        public int UserCount { get; set; }
        public List<UserAuditLogGroupDto> Result { get; set; }
    }

    public class UserAuditLogGroupDto
    {
        public int UserId { get; set; }
        public List<AuditLogDto> Sessions { get; set; }
    }

}
