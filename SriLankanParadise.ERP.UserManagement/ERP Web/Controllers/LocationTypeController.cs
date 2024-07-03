using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using SriLankanParadise.ERP.UserManagement.Business_Service;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/locationType")]
    public class LocationTypeController : BaseApiController
    {
        private readonly ILocationTypeService _locationTypeService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationTypeController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationTypeController(
            ILocationTypeService locationTypeService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationTypeController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _locationTypeService = locationTypeService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }


        [HttpGet("GetLocationTypesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetLocationTypesByCompanyId(int companyId)
        {
            try
            {
                var locationTypes = await _locationTypeService.GetLocationTypesByCompanyId(companyId);
                if (locationTypes != null)
                {
                    var locationTypeDtos = _mapper.Map<IEnumerable<LocationTypeDto>>(locationTypes);
                    AddResponseMessage(Response, LogMessages.LocationTypesRetrieved, locationTypeDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.LocationTypesNotFound);
                    AddResponseMessage(Response, LogMessages.LocationTypesNotFound, null, true, HttpStatusCode.NotFound);
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
