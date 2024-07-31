using AutoMapper;
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
    [Route("api/userLocation")]
    public class UserLocationController : BaseApiController
    {
        private readonly IUserLocationService _userLocationService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserLocationController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserLocationController(
            IUserLocationService userLocationService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<UserLocationController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _userLocationService = userLocationService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddUserLocation(UserLocationRequestModel userLocationRequest)
        {
            try
            {
                var userLocation = _mapper.Map<UserLocation>(userLocationRequest);
                await _userLocationService.AddUserLocation(userLocation);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = userLocationRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var userLocationDto = _mapper.Map<UserLocationDto>(userLocation);
                _logger.LogInformation(LogMessages.UserLocationCreated);
                AddResponseMessage(Response, LogMessages.UserLocationCreated, userLocationDto, true, HttpStatusCode.Created);
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
                var userLocations = await _userLocationService.GetAll();
                var userLocationDtos = _mapper.Map<IEnumerable<UserLocationDto>>(userLocations);
                AddResponseMessage(Response, LogMessages.UserLocationsRetrieved, userLocationDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetUserLocationsByUserId/{userId}")]
        public async Task<ApiResponseModel> GetUserLocationsByUserId(int userId)
        {
            try
            {
                var userLocations = await _userLocationService.GetUserLocationsByUserId(userId);
                if (userLocations != null)
                {
                    var userLocationDtos = _mapper.Map<IEnumerable<UserLocationDto>>(userLocations);
                    AddResponseMessage(Response, LogMessages.UserLocationsRetrieved, userLocationDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.UserLocationsNotFound);
                    AddResponseMessage(Response, LogMessages.UserLocationsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        
        [HttpPut("{userLocationId}")]
        public async Task<ApiResponseModel> UpdateUserLocation(int userLocationId, UserLocationRequestModel userLocationRequest)
        {
            try
            {
                var existinguUserLocation = await _userLocationService.GetUserLocationByUserLocationId(userLocationId);
                if (existinguUserLocation == null)
                {
                    _logger.LogWarning(LogMessages.UserLocationNotFound);
                    return AddResponseMessage(Response, LogMessages.UserLocationNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedUserLocation = _mapper.Map<UserLocation>(userLocationRequest);
                updatedUserLocation.UserLocationId = userLocationId; // Ensure the ID is not changed


                await _userLocationService.UpdateUserLocation(existinguUserLocation.UserLocationId,  updatedUserLocation);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = userLocationRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.UserLocationUpdated);
                return AddResponseMessage(Response, LogMessages.UserLocationUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{userLocationId}")]
        public async Task<ApiResponseModel> DeleteUserLocation(int userLocationId)
        {
            try
            {
                var existingUserLocation = await _userLocationService.GetUserLocationByUserLocationId(userLocationId);
                if (existingUserLocation == null)
                {
                    _logger.LogWarning(LogMessages.UserLocationNotFound);
                    return AddResponseMessage(Response, LogMessages.UserLocationNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _userLocationService.DeleteUserLocation(userLocationId);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = 1087,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.UserLocationDeleted);
                return AddResponseMessage(Response, LogMessages.UserLocationDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

    }
}
