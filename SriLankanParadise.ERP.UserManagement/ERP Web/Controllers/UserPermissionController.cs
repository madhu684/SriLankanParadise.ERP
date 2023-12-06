using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/userPermission")]
    public class UserPermissionController : BaseApiController
    {
        private readonly IUserPermissionService _userPermissionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserPermissionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserPermissionController(
            IUserPermissionService userPermissionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<UserPermissionController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _userPermissionService = userPermissionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddUserPermission(UserPermissionRequestModel userPermissionRequest)
        {
            try
            {
                var userPermission = _mapper.Map<UserPermission>(userPermissionRequest);
                await _userPermissionService.AddUserPermission(userPermission);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = userPermissionRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.UserPermissionCreated);
                AddResponseMessage(Response, LogMessages.UserPermissionCreated, null, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }
    }
}
