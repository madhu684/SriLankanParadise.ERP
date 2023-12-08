using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/submodule")]
    public class SubModuleController : BaseApiController
    {
        private readonly ISubModuleService _subModuleService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SubModuleController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SubModuleController(
            ISubModuleService subModuleService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SubModuleController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _subModuleService = subModuleService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("{moduleId}")]
        public async Task<ApiResponseModel> GetSubModulesByModuleId(int moduleId)
        {
            try
            {
                var SubModules = await _subModuleService.GetSubModulesByModuleId(moduleId);
                if (SubModules != null)
                {
                    var SubModuleDto = _mapper.Map<IEnumerable<SubModuleWithIdDto>>(SubModules);
                    AddResponseMessage(Response, LogMessages.SubModulesRetrieved, SubModuleDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SubModulesNotFound);
                    AddResponseMessage(Response, LogMessages.SubModulesNotFound, null, true, HttpStatusCode.NotFound);
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
        public async Task<ApiResponseModel> AddSubModule(SubModuleRequestModel subModuleRequest)
        {
            try
            {
                var subModule = _mapper.Map<SubModule>(subModuleRequest);
                await _subModuleService.AddSubModule(subModule);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = subModuleRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SubModuleCreated);
                AddResponseMessage(Response, LogMessages.SubModuleCreated, null, true, HttpStatusCode.Created);
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