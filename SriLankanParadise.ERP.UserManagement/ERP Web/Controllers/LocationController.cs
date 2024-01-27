using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/location")]
    public class LocationController : BaseApiController
    {

        private readonly ILocationService _locationService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationController(
            ILocationService locationService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _locationService = locationService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("GetLocationsByCompanyId")]
        public async Task<ApiResponseModel> GetLocationsByCompanyId(int companyId)
        {
            try
            {
                var locations = await _locationService.GetLocationsByCompanyId(companyId);
                if (locations != null)
                {
                    var locationDtos = _mapper.Map<IEnumerable<LocationDto>>(locations);
                    AddResponseMessage(Response, LogMessages.LocationsRetrieved, locationDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.LocationsNotFound);
                    AddResponseMessage(Response, LogMessages.LocationsNotFound, null, true, HttpStatusCode.NotFound);
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
