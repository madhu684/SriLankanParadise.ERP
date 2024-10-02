using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.ComponentModel.Design;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/userRole")]
    public class UserRoleController : BaseApiController
    {
        private readonly IUserRoleService _userRoleService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserRoleController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserRoleController(
            IUserRoleService userRoleService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<UserRoleController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _userRoleService = userRoleService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddUserRole(UserRoleRequestModel userRoleRequest)
        {
            try
            {
                var userRole = _mapper.Map<UserRole>(userRoleRequest);
                await _userRoleService.AddUserRole(userRole);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = userRoleRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.UseRoleCreated);
                AddResponseMessage(Response, LogMessages.UseRoleCreated, null, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetUserRolesByUserId/{userId}")]
        public async Task<ApiResponseModel> GetByUserId(int userId)
        {
            try
            {
                var roles = await _userRoleService.GetUserRolesByUserId(userId);
                if (roles != null)
                {
                    var rolesDto = _mapper.Map<IEnumerable<RoleDto>>(roles);
                    AddResponseMessage(Response, LogMessages.RolesRetrieved, rolesDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.RolesNotFound);
                    AddResponseMessage(Response, LogMessages.RolesNotFound, null, true, HttpStatusCode.NotFound);
                }
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
