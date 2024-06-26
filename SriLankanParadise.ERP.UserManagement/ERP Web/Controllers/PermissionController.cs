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
    [Route("api/permission")]
    public class PermissionController : BaseApiController
    {
        private readonly IPermissionService _permissionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ModuleController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PermissionController(
            IPermissionService permissionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ModuleController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _permissionService = permissionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("GetPermissionsByModuleIds")]
        public async Task<ApiResponseModel> GetPermissionsByModuleIds([FromQuery] int[] moduleIds)
        {
            try
            {
                var permissionsByModule = await _permissionService.GetPermissionsByModuleIds(moduleIds);

                if (permissionsByModule != null && permissionsByModule.Count > 0)
                {
                    var permissionsDtoByModule = permissionsByModule.ToDictionary(
                        kvp => kvp.Key,
                        kvp => _mapper.Map<List<PermissionDto>>(kvp.Value));
                    AddResponseMessage(Response, LogMessages.PermissionsRetrieved, permissionsDtoByModule, true, HttpStatusCode.OK);

                }
                else
                {
                    _logger.LogWarning(LogMessages.PermissionsNotFound);
                    AddResponseMessage(Response, LogMessages.PermissionsNotFound, null, true, HttpStatusCode.NotFound);
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
        public async Task<ApiResponseModel> AddPermission(PermissionRequestModel permissionRequest)
        {
            try
            {
                var permission = _mapper.Map<Permission>(permissionRequest);
                await _permissionService.AddPermission(permission);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = permissionRequest.PermissionRequestId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var permissionDto = _mapper.Map<PermissionDto>(permission);
                _logger.LogInformation(LogMessages.PermissionCreated);
                AddResponseMessage(Response, LogMessages.PermissionCreated, permissionDto, true, HttpStatusCode.Created);
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
                var permissions = await _permissionService.GetAll();
                var permissionDtos = _mapper.Map<IEnumerable<PermissionDto>>(permissions);
                AddResponseMessage(Response, LogMessages.PermissionsRetrieved, permissionDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetPermissionsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetPermissionsByCompanyId(int companyId)
        {
            try
            {
                var permissions = await _permissionService.GetPermissionsByCompanyId(companyId);
                if (permissions != null)
                {
                    var permissionDtos = _mapper.Map<IEnumerable<PermissionDto>>(permissions);
                    AddResponseMessage(Response, LogMessages.PermissionsRetrieved, permissionDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PermissionsNotFound);
                    AddResponseMessage(Response, LogMessages.PermissionsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPut("{permissionId}")]
        public async Task<ApiResponseModel> UpdateRole(int permissionId, PermissionRequestModel permissionRequest)
        {
            try
            {
                var existingPermission = await _permissionService.GetPermissionByPermissionId(permissionId);
                if (existingPermission == null)
                {
                    _logger.LogWarning(LogMessages.PermissionNotFound);
                    return AddResponseMessage(Response, LogMessages.PermissionNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedPermission = _mapper.Map<Permission>(permissionRequest);
                updatedPermission.PermissionId = permissionId; // Ensure the ID is not changed

                await _permissionService.UpdatePermission(existingPermission.PermissionId, updatedPermission);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = permissionRequest.PermissionRequestId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.PermissionUpdated);
                return AddResponseMessage(Response, LogMessages.PermissionUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
