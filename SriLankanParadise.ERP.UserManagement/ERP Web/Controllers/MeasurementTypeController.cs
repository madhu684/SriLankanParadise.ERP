using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/measurementType")]
    public class MeasurementTypeController : BaseApiController
    {
        private readonly IMeasurementTypeService _measurementTypeService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<MeasurementTypeController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MeasurementTypeController(
            IMeasurementTypeService measurementTypeService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<MeasurementTypeController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _measurementTypeService = measurementTypeService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddMeasurementType(MeasurementTypeRequestModel measurementTypeRequest)
        {
            try
            {
                var measurementType = _mapper.Map<MeasurementType>(measurementTypeRequest);
                await _measurementTypeService.AddMeasurementType(measurementType);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = measurementTypeRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var measurementTypeDto = _mapper.Map<MeasurementTypeDto>(measurementType);
                _logger.LogInformation(LogMessages.MeasurementTypeCreated);
                AddResponseMessage(Response, LogMessages.MeasurementTypeCreated, measurementTypeDto, true, HttpStatusCode.Created);
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
                var measurementTypes = await _measurementTypeService.GetAll();
                var measurementTypeDtos = _mapper.Map<IEnumerable<MeasurementTypeDto>>(measurementTypes);
                AddResponseMessage(Response, LogMessages.MeasurementTypesRetrieved, measurementTypeDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetMeasurementTypesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetMeasurementTypesByCompanyId(int companyId)
        {
            try
            {
                var measurementTypes = await _measurementTypeService.GetMeasurementTypesByCompanyId(companyId);
                if (measurementTypes != null)
                {
                    var measurementTypeDtos = _mapper.Map<IEnumerable<MeasurementTypeDto>>(measurementTypes);
                    AddResponseMessage(Response, LogMessages.MeasurementTypesRetrieved, measurementTypeDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.MeasurementTypesNotFound);
                    AddResponseMessage(Response, LogMessages.MeasurementTypesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetAllMeasurementTypesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetAllMeasurementTypesByCompanyId(int companyId)
        {
            try
            {
                var measurementTypes = await _measurementTypeService.GetAllMeasurementTypesByCompanyId(companyId);
                if (measurementTypes != null)
                {
                    var measurementTypeDtos = _mapper.Map<IEnumerable<MeasurementTypeDto>>(measurementTypes);
                    AddResponseMessage(Response, LogMessages.CategoriesRetrieved, measurementTypeDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.MeasurementTypesNotFound);
                    AddResponseMessage(Response, LogMessages.MeasurementTypesNotFound, null, true, HttpStatusCode.NotFound);
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
