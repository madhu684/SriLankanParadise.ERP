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
        public async Task<ApiResponseModel> GetRolesByModuleIds([FromQuery] int[] moduleIds)
        {
            try
            {
                var rolesByModule = await _roleService.GetRolesByModuleIds(moduleIds);

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
    }
}
