using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service;
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
    [Route("api/rolePermission")]
    public class RolePermissionController : BaseApiController
    {
        private readonly IRolePermissionService _rolePermissionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<RolePermissionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RolePermissionController(
            IRolePermissionService rolePermissionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<RolePermissionController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _rolePermissionService = rolePermissionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddRolePermission(RolePermissionRequestModel rolePermissionRequest)
        {
            try
            {
                var rolePermission = _mapper.Map<RolePermission>(rolePermissionRequest);
                await _rolePermissionService.AddRolePermission(rolePermission);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = rolePermissionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.RolePermissionCreated);
                AddResponseMessage(Response, LogMessages.RolePermissionCreated, null, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("UpdateRolePermissions/{roleId}")]
        public async Task<ApiResponseModel> UpdateRolePermissions([FromRoute] int roleId, [FromBody] int[] permissionIds)
        {
            try
            {
                // get existing role permission
                var existingRolePermission = await _rolePermissionService.GetRolePermissionsByRoleId(roleId);

                // reduced permissionIds
                var reducedPermissionIds = existingRolePermission
                    .Select(rp => rp.PermissionId)
                    .Except(permissionIds)
                    .ToList();

                // newly added permissionIds
                var newlyAddedPermissionIds = permissionIds
                    .Except(existingRolePermission
                        .Select(rp => rp.PermissionId)
                        .ToList()
                    );

                // remove reduced role permissions
                foreach (var permissionId in reducedPermissionIds)
                {
                    var isRolePermissionAlreadyAssigned = await _rolePermissionService.IsRolePermissionAlreadyAssigned(permissionId);

                    if (!isRolePermissionAlreadyAssigned)
                    {
                        await _rolePermissionService.DeleteRolePermission(roleId, permissionId);
                    }
                }
                    
                // create newly added role permissions
                foreach (var permissionId in permissionIds)
                {
                    var rolePermission = new RolePermission()
                    {
                        RoleId = roleId,
                        PermissionId = permissionId
                    };
                    await _rolePermissionService.AddRolePermission(rolePermission);
                }

                _logger.LogInformation(LogMessages.RolePermissionsUpdated);
                AddResponseMessage(Response, LogMessages.RolePermissionsUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetRolePermissionsByRoleIds")]
        public async Task<ApiResponseModel> GetPermissionsByModuleIds([FromQuery] int[] roleIds)
        {
            try
            {
                var rolePermissions = await _rolePermissionService.GetRolePermissionsByRoleIds(roleIds);

                if (rolePermissions != null && rolePermissions.Count > 0)
                {
                    var rolePermissionsDtoByRole = rolePermissions.ToDictionary(
                        kvp => kvp.Key,
                        kvp => _mapper.Map<List<RolePermissionDto>>(kvp.Value));
                    AddResponseMessage(Response, LogMessages.RolePermissionsRetrieved, rolePermissionsDtoByRole, true, HttpStatusCode.OK);

                }
                else
                {
                    _logger.LogWarning(LogMessages.RolePermissionsNotFound);
                    AddResponseMessage(Response, LogMessages.RolePermissionsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        [HttpDelete("DeleteRolePermissionByRoleId/{roleId}")]
        public async Task<ApiResponseModel> DeleteRolePermissionByRoleId(int roleId)
        {
            try
            {
                var existingmappings = await _rolePermissionService.GetRolePermissionsByRoleId(roleId);
                if (existingmappings != null)
                {
                    await _rolePermissionService.DeleteRolePermissionByRoleId(roleId);
                    AddResponseMessage(Response, "Role permissions deleted successfully.", null, true, HttpStatusCode.OK);
                }
                else
                {
                    AddResponseMessage(Response, "No role permissions found for the given roleId.", null, true, HttpStatusCode.NotFound);
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
