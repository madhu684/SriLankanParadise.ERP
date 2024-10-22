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

        [HttpGet("{locationId}")]
        public async Task<ApiResponseModel> GetLocationByLocationId(int locationId)
        {
            try
            {
                var location = await _locationService.GetLocationByLocationId(locationId);
                if (location != null)
                {
                    var locationDto = _mapper.Map<LocationDto>(location);
                    AddResponseMessage(Response, LogMessages.LocationRetrieved, locationDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.LocationNotFound);
                    AddResponseMessage(Response, LogMessages.LocationNotFound, null, true, HttpStatusCode.NotFound);
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
        public async Task<ApiResponseModel> AddLocation(LocationRequestModel locationRequest)
        {
            try
            {
                var location = _mapper.Map<Location>(locationRequest);
                await _locationService.AddLocation(location);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var locationDto = _mapper.Map<LocationDto>(location);
                _logger.LogInformation(LogMessages.LocationCreated);
                AddResponseMessage(Response, LogMessages.LocationCreated, locationDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPut("{locationId}")]
        public async Task<ApiResponseModel> UpdateLocation(int locationId, LocationRequestModel locationRequest)
        {
            try
            {
                var existingLocation = await _locationService.GetLocationByLocationId(locationId);
                if (existingLocation == null)
                {
                    _logger.LogWarning(LogMessages.LocationNotFound);
                    return AddResponseMessage(Response, LogMessages.LocationNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedLocation = _mapper.Map<Location>(locationRequest);
                updatedLocation.LocationId = locationId; // Ensure the ID is not changed

                await _locationService.UpdateLocation(existingLocation.LocationId, updatedLocation);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.LocationUpdated);
                return AddResponseMessage(Response, LogMessages.LocationUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetLocationsByLocationIds")]
        public async Task<ApiResponseModel> GetLocationsByLocationIds([FromQuery] int[] locationIds)
        {
            try
            {
                var locations = await _locationService.GetLocationsByLocationIds(locationIds);
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
        
        [HttpGet("GetWarehousesForSpecifcDepartment/{departmentLocId}")]
        public async Task<ApiResponseModel> GetWarehousesForSpecifcDepartment(int departmentLocId)
        {
            try
            {
                var locations = await _locationService.GetWarehousesForSpecifcDepartment(departmentLocId);
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
