using AutoMapper;
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
    [Route("api/module")]
    public class ModuleController : BaseApiController
    {
        private readonly IModuleService _moduleService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ModuleController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ModuleController(
            IModuleService moduleService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ModuleController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _moduleService = moduleService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("{moduleId}")]
        public async Task<ApiResponseModel> GetModuleByModuleId(int moduleId)
        {
            try
            {
                var Module = await _moduleService.GetModuleByModuleId(moduleId);
                if (Module != null)
                {
                    var ModuleDto = _mapper.Map<ModuleDto>(Module);
                    AddResponseMessage(Response, LogMessages.ModuleRetrieved, ModuleDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ModuleNotFound);
                    AddResponseMessage(Response, LogMessages.ModuleNotFound, null, true, HttpStatusCode.NotFound);
                }
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
                var modules = await _moduleService.GetAll();
                var moduleDtos = _mapper.Map<IEnumerable<ModuleDto>>(modules);
                AddResponseMessage(Response, LogMessages.ModulesRetrieved, moduleDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddModule(ModuleRequestModel moduleRequest)
        {
            try
            {
                var module = _mapper.Map<Module>(moduleRequest);
                await _moduleService.AddModule(module);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = moduleRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ModuleCreated);
                AddResponseMessage(Response, LogMessages.ModuleCreated, null, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{ModuleId}")]
        public async Task<ApiResponseModel> UpdateModule(int moduleId, ModuleRequestModel moduleRequest)
        {
            try
            {
                var existingModule = await _moduleService.GetModuleByModuleId(moduleId);
                if (existingModule == null)
                {
                    _logger.LogWarning(LogMessages.ModuleNotFound);
                    return AddResponseMessage(Response, LogMessages.ModuleNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedModule = _mapper.Map<Module>(moduleRequest);
                updatedModule.ModuleId = moduleId; // Ensure the ID is not changed

                await _moduleService.UpdateModule(existingModule.ModuleId, updatedModule);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = moduleRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ModuleUpdated);
                return AddResponseMessage(Response, LogMessages.ModuleUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        //[HttpDelete("{ModuleId}")]
        //public async Task<ApiResponseModel> DeleteModule(int ModuleId)
        //{
        //    try
        //    {
        //        var existingModule = await _moduleService.GetModuleByModuleId(ModuleId);
        //        if (existingModule == null)
        //        {
        //            _logger.LogWarning(LogMessages.ModuleNotFound);
        //            return ApiResponse.Error("Module not found", HttpStatusCode.NotFound);
        //        }

        //        await _moduleService.DeleteModule(ModuleId);
        //        _logger.LogInformation(LogMessages.ModuleDeleted);
        //        return ApiResponse.Success("Module deleted successfully", HttpStatusCode.NoContent);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, ErrorMessages.InternalServerError);
        //        return ApiResponse.Error(ex.Message, HttpStatusCode.InternalServerError);
        //    }
        //}

        [HttpGet("GetModulesByUserId")]
        public async Task<ApiResponseModel> GetModuleByUserId(int userId)
        {
            try
            {
                var modules = await _moduleService.GetModulesByUserId(userId);
                if (modules != null)
                {
                    var moduleWithDto = _mapper.Map<IEnumerable<ModuleWithIdDto>>(modules);
                    AddResponseMessage(Response, LogMessages.ModulesRetrieved, moduleWithDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ModulesNotFound);
                    AddResponseMessage(Response, LogMessages.ModulesNotFound, null, true, HttpStatusCode.NotFound);
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
