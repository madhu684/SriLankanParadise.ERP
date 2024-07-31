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
    [Route("api/locationInventoryGoodsInTransit")]
    public class LocationInventoryGoodsInTransitController : BaseApiController
    {
        private readonly ILocationInventoryGoodsInTransitService _locationInventoryGoodsInTransitService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationInventoryGoodsInTransitController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationInventoryGoodsInTransitController(
            ILocationInventoryGoodsInTransitService locationInventoryGoodsInTransitService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationInventoryGoodsInTransitController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _locationInventoryGoodsInTransitService = locationInventoryGoodsInTransitService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddLocationInventoryGoodsInTransit(LocationInventoryGoodsInTransitRequestModel locationInventoryGoodsInTransitRequest)
        {
            try
            {
                var locationInventoryGoodsInTransit = _mapper.Map<LocationInventoryGoodsInTransit>(locationInventoryGoodsInTransitRequest);
                await _locationInventoryGoodsInTransitService.AddLocationInventoryGoodsInTransit(locationInventoryGoodsInTransit);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationInventoryGoodsInTransitRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var locationInventoryGoodsInTransitDto = _mapper.Map<LocationInventoryGoodsInTransitDto>(locationInventoryGoodsInTransit);
                _logger.LogInformation(LogMessages.LocationInventoryGoodsInTransitCreated);
                AddResponseMessage(Response, LogMessages.LocationInventoryGoodsInTransitCreated, locationInventoryGoodsInTransitDto, true, HttpStatusCode.Created);
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
                var locationInventoryGoodsInTransits = await _locationInventoryGoodsInTransitService.GetAll();
                var locationInventoryGoodsInTransitDtos = _mapper.Map<IEnumerable<LocationInventoryGoodsInTransitDto>>(locationInventoryGoodsInTransits);
                AddResponseMessage(Response, LogMessages.LocationInventoryGoodsInTransitsRetrieved, locationInventoryGoodsInTransitDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPut("{locationInventoryGoodsInTransitId}")]
        public async Task<ApiResponseModel> UpdateLocationInventoryGoodsInTransit(int locationInventoryGoodsInTransitId, LocationInventoryGoodsInTransitRequestModel locationInventoryGoodsInTransitRequest)
        {
            try
            {
                var existingLocationInventoryGoodsInTransit = await _locationInventoryGoodsInTransitService.GetLocationInventoryGoodsInTransitByLocationInventoryGoodsInTransitId(locationInventoryGoodsInTransitId);
                if (existingLocationInventoryGoodsInTransit == null)
                {
                    _logger.LogWarning(LogMessages.LocationInventoryGoodsInTransitNotFound);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryGoodsInTransitNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedLocationInventoryGoodsInTransit = _mapper.Map<LocationInventoryGoodsInTransit>(locationInventoryGoodsInTransitRequest);
                updatedLocationInventoryGoodsInTransit.LocationInventoryGoodsInTransitId = locationInventoryGoodsInTransitId; // Ensure the ID is not changed


                await _locationInventoryGoodsInTransitService.UpdateLocationInventoryGoodsInTransit(existingLocationInventoryGoodsInTransit.LocationInventoryGoodsInTransitId, updatedLocationInventoryGoodsInTransit);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationInventoryGoodsInTransitRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.LocationInventoryGoodsInTransitUpdated);
                return AddResponseMessage(Response, LogMessages.LocationInventoryGoodsInTransitUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPatch("{toLocationId}/{fromLocationId}/{itemMasterId}/{batchId}")]
        public async Task<ApiResponseModel> UpdateLocationInventoryGoodsInTransitStatus(int toLocationId, int fromLocationId, int itemMasterId, int batchId, LocationInventoryGoodsInTransitRequestModel locationInventoryGoodsInTransitRequest)
        {
            try
            {
                var existingLocationInventoryGoodsInTransit = await _locationInventoryGoodsInTransitService.GetLocationInventoryGoodsInTransitByDetails(toLocationId, fromLocationId, itemMasterId, batchId);
                if (existingLocationInventoryGoodsInTransit == null)
                {
                    _logger.LogWarning(LogMessages.LocationInventoryGoodsInTransitNotFound);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryGoodsInTransitNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedLocationInventoryGoodsInTransit = _mapper.Map<LocationInventoryGoodsInTransit>(locationInventoryGoodsInTransitRequest);
                updatedLocationInventoryGoodsInTransit.LocationInventoryGoodsInTransitId = existingLocationInventoryGoodsInTransit.LocationInventoryGoodsInTransitId; // Ensure the ID is not changed

                await _locationInventoryGoodsInTransitService.UpdateLocationInventoryGoodsInTransitStatus(toLocationId, fromLocationId, itemMasterId, batchId, updatedLocationInventoryGoodsInTransit);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationInventoryGoodsInTransitRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.LocationInventoryGoodsInTransitUpdated);
                return AddResponseMessage(Response, LogMessages.LocationInventoryGoodsInTransitUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
