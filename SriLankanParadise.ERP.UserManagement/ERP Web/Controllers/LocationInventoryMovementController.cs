using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/locationInventoryMovement")]
    public class LocationInventoryMovementController : BaseApiController
    {
        private readonly ILocationInventoryMovementService _locationInventoryMovementService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationInventoryMovementController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationInventoryMovementController(
            ILocationInventoryMovementService locationInventoryMovementService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationInventoryMovementController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _locationInventoryMovementService = locationInventoryMovementService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddLocationInventoryMovement(LocationInventoryMovementRequestModel locationInventoryMovementRequest)
        {
            try
            {
                var locationInventoryMovement = _mapper.Map<LocationInventoryMovement>(locationInventoryMovementRequest);
                await _locationInventoryMovementService.AddLocationInventoryMovement(locationInventoryMovement);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationInventoryMovementRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var locationInventoryMovementDto = _mapper.Map<LocationInventoryMovementDto>(locationInventoryMovement);
                _logger.LogInformation(LogMessages.LocationInventoryMovementCreated);
                AddResponseMessage(Response, LogMessages.LocationInventoryMovementCreated, locationInventoryMovementDto, true, HttpStatusCode.Created);
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
                var locationInventoryMovements = await _locationInventoryMovementService.GetAll();
                var locationInventoryMovementDtos = _mapper.Map<IEnumerable<LocationInventoryMovementDto>>(locationInventoryMovements);
                AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventoryMovementDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPut("{locationInventoryMovementId}")]
        public async Task<ApiResponseModel> UpdateLocationInventoryMovement(int locationInventoryMovementId, LocationInventoryMovementRequestModel locationInventoryMovementRequest)
        {
            try
            {
                var existingLocationInventoryMovement = await _locationInventoryMovementService.GetLocationInventoryMovementByLocationInventoryMovementId(locationInventoryMovementId);
                if (existingLocationInventoryMovement == null)
                {
                    _logger.LogWarning(LogMessages.LocationInventoryMovementNotFound);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryMovementNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedLocationInventoryMovement = _mapper.Map<LocationInventoryMovement>(locationInventoryMovementRequest);
                updatedLocationInventoryMovement.LocationInventoryMovementId = locationInventoryMovementId; // Ensure the ID is not changed


                await _locationInventoryMovementService.UpdateLocationInventoryMovement(existingLocationInventoryMovement.LocationInventoryMovementId, updatedLocationInventoryMovement);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationInventoryMovementRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.LocationInventoryMovementUpdated);
                return AddResponseMessage(Response, LogMessages.LocationInventoryMovementUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
