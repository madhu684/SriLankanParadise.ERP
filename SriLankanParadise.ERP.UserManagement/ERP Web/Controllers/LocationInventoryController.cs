using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/locationInventory")]
    public class LocationInventoryController : BaseApiController
    {
        private readonly ILocationInventoryService _locationInventoryService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationInventoryController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationInventoryController(
            ILocationInventoryService locationInventoryService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationInventoryController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _locationInventoryService = locationInventoryService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddLocationInventory(LocationInventoryRequestModel locationInventoryRequest)
        {
            try
            {
                var locationInventory = _mapper.Map<LocationInventory>(locationInventoryRequest);
                await _locationInventoryService.AddLocationInventory(locationInventory, locationInventoryRequest.MovementTypeId);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationInventoryRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var locationInventoryDto = _mapper.Map<LocationInventoryDto>(locationInventory);
                _logger.LogInformation(LogMessages.LocationInventoryCreated);
                AddResponseMessage(Response, LogMessages.LocationInventoryCreated, locationInventoryDto, true, HttpStatusCode.Created);
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
                var locationInventories = await _locationInventoryService.GetAll();
                var locationInventoryDtos = _mapper.Map<IEnumerable<LocationInventoryDto>>(locationInventories);
                AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventoryDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetLocationInventoriesByLocationId/{locationId}")]
        public async Task<ApiResponseModel> GetLocationInventoriesByLocationId(int locationId)
        {
            try
            {
                var locationInventories = await _locationInventoryService.GetLocationInventoriesByLocationId(locationId);
                if (locationInventories != null)
                {
                    var locationInventoryDtos = _mapper.Map<IEnumerable<LocationInventoryDto>>(locationInventories);
                    AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventoryDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.LocationInventoriesNotFound);
                    AddResponseMessage(Response, LogMessages.LocationInventoriesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetUniqueLocationInventory/{locationId}/{itemMasterId}/{batchNo}")]
        public async Task<ApiResponseModel> GetUniqueLocationInventory(int locationId, int itemMasterId, string batchNo)
        {
            try
            {
                var locationInventory = await _locationInventoryService.GetUniqueLocationInventory(locationId, itemMasterId, batchNo);
                var locationInventoryDto = _mapper.Map<LocationInventoryDto>(locationInventory);
                AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventoryDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPut("{locationInventoryId}")]
        public async Task<ApiResponseModel> UpdateLocationInventory(int locationInventoryId, LocationInventoryRequestModel locationInventoryRequest)
        {
            try
            {
                var existingLocationInventory = await _locationInventoryService.GetLocationInventoryByLocationInventoryId(locationInventoryId);
                if (existingLocationInventory == null)
                {
                    _logger.LogWarning(LogMessages.LocationInventoryNotFound);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedLocationInventory = _mapper.Map<LocationInventory>(locationInventoryRequest);
                updatedLocationInventory.LocationInventoryId = locationInventoryId; // Ensure the ID is not changed


                await _locationInventoryService.UpdateLocationInventory(existingLocationInventory.LocationInventoryId, updatedLocationInventory);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationInventoryRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.LocationInventoryUpdated);
                return AddResponseMessage(Response, LogMessages.LocationInventoryUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPatch("updateStockInHand/{locationId}/{itemMasterId}/{batchId}/{operation}")]
        public async Task<ApiResponseModel> UpdateLocationInventoryStockInHand(int locationId, int itemMasterId, int batchId, string operation, UpdateLocationInventoryStockInHandRequestModel locationInventoryStockInHandRequest)
        {
            try
            {
                var existingLocationInventory = await _locationInventoryService.GetLocationInventoryByDetails(locationId, itemMasterId, batchId);
                if (existingLocationInventory == null)
                {
                    _logger.LogWarning(LogMessages.LocationInventoryNotFound);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedLocationInventory = _mapper.Map<LocationInventory>(locationInventoryStockInHandRequest);
                updatedLocationInventory.LocationInventoryId = existingLocationInventory.LocationInventoryId; // Ensure the ID is not changed

                await _locationInventoryService.UpdateLocationInventoryStockInHand(locationId, itemMasterId, batchId, updatedLocationInventory, operation);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = locationInventoryStockInHandRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.LocationInventoryUpdated);
                return AddResponseMessage(Response, LogMessages.LocationInventoryUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

    }
}
