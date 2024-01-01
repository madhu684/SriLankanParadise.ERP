using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
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
    }
}
