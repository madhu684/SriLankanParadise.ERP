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
    [Route("api/role")]
    public class RoleController : BaseApiController
    {
        private readonly IRoleService _roleService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ModuleController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RoleController(
            IRoleService roleService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ModuleController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _roleService = roleService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("GetRolesByModuleIds")]
        public async Task<ApiResponseModel> GetRolesByModuleIds(int companyId, [FromQuery] int[] moduleIds)
        {
            try
            {
                var rolesByModule = await _roleService.GetRolesByModuleIds(companyId, moduleIds);

                if (rolesByModule != null && rolesByModule.Count > 0)
                {
                    var rolesDtoByModule = rolesByModule.ToDictionary(
                        kvp => kvp.Key,
                        kvp => _mapper.Map<List<RoleDto>>(kvp.Value));
                    AddResponseMessage(Response, LogMessages.RolesRetrieved, rolesDtoByModule, true, HttpStatusCode.OK);
                    
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

        [HttpPost]
        public async Task<ApiResponseModel> AddRole(RoleRequestModel roleRequest)
        {
            try
            {
                var role = _mapper.Map<Role>(roleRequest);
                await _roleService.AddRole(role);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = roleRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var RoleDto = _mapper.Map<RoleDto>(role);
                _logger.LogInformation(LogMessages.RoleCreated);
                AddResponseMessage(Response, LogMessages.RoleCreated, RoleDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet]
        public async Task<ApiResponseModel> GetAll()
        {
            try
            {
                var roles = await _roleService.GetAll();
                var RoleDtos = _mapper.Map<IEnumerable<RoleDto>>(roles);
                AddResponseMessage(Response, LogMessages.RolesRetrieved, RoleDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetRolesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetRolesByCompanyId(int companyId)
        {
            try
            {
                var roles = await _roleService.GetRolesByCompanyId(companyId);
                if (roles != null)
                {
                    var roleDtos = _mapper.Map<IEnumerable<RoleDto>>(roles);
                    AddResponseMessage(Response, LogMessages.RolesRetrieved, roleDtos, true, HttpStatusCode.OK);
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


        [HttpPut("{roleId}")]
        public async Task<ApiResponseModel> UpdateRole(int roleId, RoleRequestModel roleRequest)
        {
            try
            {
                var existingRole = await _roleService.GetRoleByRoleId(roleId);
                if (existingRole == null)
                {
                    _logger.LogWarning(LogMessages.RoleNotFound);
                    return AddResponseMessage(Response, LogMessages.RoleNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedRole = _mapper.Map<Role>(roleRequest);
                updatedRole.RoleId = roleId; // Ensure the ID is not changed

                await _roleService.UpdateRole(existingRole.RoleId, updatedRole);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = roleRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.RoleUpdated);
                return AddResponseMessage(Response, LogMessages.RoleUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{roleId}")]
        public async Task<ApiResponseModel> Delete(int roleId)
        {
            try
            {
                var existingRole = await _roleService.GetRoleByRoleId(roleId);
                if (existingRole == null)
                {
                    _logger.LogWarning(LogMessages.RoleNotFound);
                    return AddResponseMessage(Response, LogMessages.RoleNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _roleService.Delete(roleId);

                _logger.LogInformation(LogMessages.RoleDeleted);
                return AddResponseMessage(Response, LogMessages.RoleDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
