using AutoMapper;
using Azure;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using SriLankanParadise.ERP.UserManagement.Business_Service;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/unit")]
    public class UnitController : BaseApiController
    {
        private readonly IUnitService _unitService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<UnitController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UnitController(
            IUnitService unitService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<UnitController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _unitService = unitService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddUnit(UnitRequestModel unitRequest)
        {
            try
            {
                var unit = _mapper.Map<Unit>(unitRequest);
                await _unitService.AddUnit(unit);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = unitRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var unitDto = _mapper.Map<UnitDto>(unit);
                _logger.LogInformation(LogMessages.UnitCreated);
                AddResponseMessage(Response, LogMessages.UnitCreated, unitDto, true, HttpStatusCode.Created);
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
                var units = await _unitService.GetAll();
                var unitDtos = _mapper.Map<IEnumerable<UnitDto>>(units);
                AddResponseMessage(Response, LogMessages.UnitsRetrieved, unitDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetUnitsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetUnitsByCompanyId(int companyId)
        {
            try
            {
                var units = await _unitService.GetUnitsByCompanyId(companyId);
                if (units != null)
                {
                    var unitDtos = _mapper.Map<IEnumerable<UnitDto>>(units);
                    AddResponseMessage(Response, LogMessages.UnitsRetrieved, unitDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.UnitsNotFound);
                    AddResponseMessage(Response, LogMessages.UnitsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetAllUnitsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetAllUnitsByCompanyId(int companyId)
        {
            try
            {
                var units = await _unitService.GetAllUnitsByCompanyId(companyId);
                if (units != null)
                {
                    var unitDtos = _mapper.Map<IEnumerable<UnitDto>>(units);
                    AddResponseMessage(Response, LogMessages.UnitsRetrieved, unitDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.UnitsNotFound);
                    AddResponseMessage(Response, LogMessages.UnitsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{unitId}")]
        public async Task<ApiResponseModel> UpdateUnit(int unitId, UnitRequestModel unitRequest)
        {
            try
            {
                var existingUnit = await _unitService.GetUnitByUnitId(unitId);
                if (existingUnit == null)
                {
                    _logger.LogWarning(LogMessages.UnitNotFound);
                    return AddResponseMessage(Response, LogMessages.UnitNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedUnit = _mapper.Map<Unit>(unitRequest);
                updatedUnit.UnitId = unitId; // Ensure the ID is not changed

                await _unitService.UpdateUnit(existingUnit.UnitId, updatedUnit);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = unitRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.UnitUpdated);
                return AddResponseMessage(Response, LogMessages.UnitUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{unitId}")]
        public async Task<ApiResponseModel> DeleteUnit(int unitId)
        {
            try
            {
                var existingUnit = await _unitService.GetUnitByUnitId(unitId);
                if (existingUnit == null)
                {
                    _logger.LogWarning(LogMessages.UnitNotFound);
                    return AddResponseMessage(Response, LogMessages.UnitNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _unitService.DeleteUnit(unitId);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = 1046,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.UnitDeleted);
                return AddResponseMessage(Response, LogMessages.UnitDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
