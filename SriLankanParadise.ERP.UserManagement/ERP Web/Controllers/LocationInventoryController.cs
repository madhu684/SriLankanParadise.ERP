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
        private readonly IUnitService _unitService;
        private readonly IBatchService _batchService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationInventoryController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationInventoryController(
            ILocationInventoryService locationInventoryService,
            IUnitService unitService,
            IBatchService batchService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationInventoryController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _locationInventoryService = locationInventoryService;
            _unitService = unitService;
            _batchService = batchService;
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

        [HttpGet("GetLocationInventoryByLocationInventoryId/{locationInventoryId}")]
        public async Task<ApiResponseModel> GetLocationInventoryByLocationInventoryId(int locationInventoryId)
        {
            try
            {
                var locationInventory = await _locationInventoryService.GetLocationInventoryByLocationInventoryId(locationInventoryId);
                var locationInventoryDto = _mapper.Map<LocationInventoryDto>(locationInventory);

                _logger.LogInformation(LogMessages.LocationInventoriesRetrieved);
                AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventoryDto, true, HttpStatusCode.OK);
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

        [HttpGet("GetEmptyReturnItemLocationInventoriesByLocationId/{locationId}")]
        public async Task<ApiResponseModel> GetEmptyReturnItemLocationInventoriesByLocationId([FromQuery] int companyId, int locationId)
        {
            try
            {
                var locationInventories = await _locationInventoryService.GetEmptyReturnItemLocationInventoriesByLocationId(companyId, locationId);
                if (locationInventories != null)
                {
                    var locationInventoryDtos = _mapper.Map<IEnumerable<EmptyReturnItemLocationInventoryDto>>(locationInventories);
                    AddResponseMessage(Response, LogMessages.EmptyReturnItemLocationInventoriesRetrieved, locationInventoryDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.LocationInventoriesNotFound);
                    AddResponseMessage(Response, LogMessages.EmptyReturnItemLocationInventoriesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemLocationInventoriesByLocationId/{locationId}")]
        public async Task<ApiResponseModel> GetItemLocationInventoriesByLocationId(int locationId)
        {
            try
            {
                var locationInventories = await _locationInventoryService.GetItemLocationInventoriesByLocationId(locationId);

                if (locationInventories == null || !locationInventories.Any())
                {
                    _logger.LogWarning(LogMessages.LocationInventoriesNotFound);
                    return AddResponseMessage(Response, LogMessages.LocationInventoriesNotFound, null, true, HttpStatusCode.NotFound);
                }

                var locationInventoryDtos = new List<LocationInventoryItemDto>();
                foreach (var locationInventory in locationInventories)
                {
                    // Ensure we're using the correct ID fields
                    var unit = await _unitService.GetUnitByUnitId(locationInventory.ItemMaster?.UnitId ?? 0);
                    //var batch = await _batchService.GetBatchById(locationInventory.BatchId);

                    // Initialize batch variable to ensure it's always available
                    Batch batch = null;

                    // Check if BatchId is not null before calling GetBatchById
                    if (locationInventory.BatchId.HasValue)
                    {
                        batch = await _batchService.GetBatchById(locationInventory.BatchId.Value);
                    }

                    locationInventoryDtos.Add(new LocationInventoryItemDto
                    {
                        LocationInventoryId = locationInventory.LocationInventoryId,
                        ItemMasterId = locationInventory.ItemMasterId,
                        ItemName = locationInventory.ItemMaster?.ItemName ?? "N/A",
                        ItemCode = locationInventory.ItemMaster?.ItemCode ?? "N/A",
                        UnitId = locationInventory.ItemMaster?.UnitId ?? 0,
                        UnitName = unit?.UnitName ?? "N/A",
                        BatchId = locationInventory.BatchId,
                        LocationId = locationInventory.LocationId,
                        BatchNo = batch?.BatchRef ?? locationInventory.BatchNo ?? "N/A",
                        StockInHand = locationInventory.StockInHand,
                        ReOrderLevel = locationInventory.ReOrderLevel,
                        MaxStockLevel = locationInventory.MaxStockLevel
                    });
                }

                _logger.LogInformation(LogMessages.LocationInventoriesRetrieved);
                return AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventoryDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetLocationInventoriesByLocationIdItemMasterId/{locationId}/{itemMasterId}")]
        public async Task<ApiResponseModel> GetLocationInventoriesByLocationIdItemMasterId(int locationId, int itemMasterId)
        {
            try
            {
                var locationInventories = await _locationInventoryService.GetLocationInventoriesByLocationIdItemMasterId(locationId, itemMasterId);
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

        [HttpGet("GetLocationInventoryByBatchId/{batchId}")]
        public async Task<ApiResponseModel> GetLocationInventoryByBatchRefWithQuery(int batchId)
        {
            try
            {
                var locationInventories = await _locationInventoryService.GetLocationInventoryByBatchId(batchId);
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

        [HttpPatch("updateEmptyStockInHand/{locationId}/{itemMasterId}/{operation}")]
        public async Task<ApiResponseModel> UpdateLocationInventoryEmptyStockInHand(int locationId, int itemMasterId, string operation, UpdateLocationInventoryStockInHandRequestModel locationInventoryStockInHandRequest)
        {
            try
            {
                var existingLocationInventory = await _locationInventoryService.GetEmptyLocationInventoryByDetails(locationId, itemMasterId);
                if (existingLocationInventory == null)
                {
                    _logger.LogWarning(LogMessages.LocationInventoryNotFound);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedLocationInventory = _mapper.Map<LocationInventory>(locationInventoryStockInHandRequest);
                updatedLocationInventory.LocationInventoryId = existingLocationInventory.LocationInventoryId; // Ensure the ID is not changed

                await _locationInventoryService.UpdateEmptyLocationInventoryStockInHand(locationId, itemMasterId, updatedLocationInventory, operation);

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

        [HttpGet("GetSumLocationInventoriesByLocationIdItemMasterId/{itemMasterId}")]
        public async Task<ApiResponseModel> GetSumLocationInventoriesByLocationIdItemMasterId([FromRoute] int itemMasterId, [FromQuery] int? locationId = null)
        {
            try
            {
                var locationInventorySummary = await _locationInventoryService.GetSumLocationInventoriesByLocationIdItemMasterId(locationId, itemMasterId);
                if (locationInventorySummary != null)
                {
                    var locationInventorySummaryDto = _mapper.Map<LocationInventorySummaryDto>(locationInventorySummary);
                    AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventorySummaryDto, true, HttpStatusCode.OK);
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

        [HttpGet("GetLowStockItems")]
        public async Task<ApiResponseModel> GetLowStockItems(int? supplierId = null, int? locationId = null)
        {
            try
            {
                var lowStockItems = await _locationInventoryService.GetLowStockItems(supplierId, locationId);
                if (lowStockItems != null && lowStockItems.Any())
                {
                    var lowStockItemsDtos = _mapper.Map<IEnumerable<LocationInventorySummaryDto>>(lowStockItems);
                    AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, lowStockItemsDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogInformation("All items are more than min re order level");
                    AddResponseMessage(Response, "All items are more than min re order level", new List<LocationInventorySummaryDto>(), true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPost("reduce-inventory-fifo")]
        public async Task<ApiResponseModel> ReduceInventoryByFIFO(ReduceInventoryRequestModel request)
        {
            try
            {
                await _locationInventoryService.ReduceInventoryByFIFO(request.LocationId, request.ItemMasterId, request.TransactionTypeId, request.Quantity);

                _logger.LogInformation("Inventory reduced successfully using FIFO method");
                AddResponseMessage(Response, "Inventory reduced successfully", null, true, HttpStatusCode.OK);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex.Message);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetLowStockItemsByLocationOnly/{locationId}")]
        public async Task<ApiResponseModel> GetLowStockItemsByLocationOnly(int locationId)
        {
            try
            {
                var lowStockItems = await _locationInventoryService.GetLowStockItemsByLocationOnly(locationId);
                if (lowStockItems != null && lowStockItems.Any())
                {
                    var lowStockItemsDtos = _mapper.Map<IEnumerable<LocationInventorySummaryDto>>(lowStockItems);
                    AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, lowStockItemsDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogInformation("All items are more than min re order level for the specified location");
                    AddResponseMessage(Response, "All items are more than min re order level for the specified location", new List<LocationInventorySummaryDto>(), true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetLocationInventorySummaryByItemName")]
        public async Task<ApiResponseModel> GetLocationInventorySummaryByItemName([FromQuery] int? locationId, [FromQuery] string itemName, [FromQuery] int? supplierId = null)
        {
            try
            {
                var summary = await _locationInventoryService.GetSumLocationInventoriesByItemName(locationId, itemName, supplierId);

                if (summary != null)
                {
                    var summaryDto = _mapper.Map<IEnumerable<LocationInventorySummaryDto>>(summary);
                    AddResponseMessage(Response, LogMessages.LocationInventorySummaryRetrieved, summaryDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.LocationInventorySummaryNotFound);
                    AddResponseMessage(Response, LogMessages.LocationInventorySummaryNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetSumOfItemInventoryByLocationId/{locationId}")]
        public async Task<ApiResponseModel> GetSumOfItemInventoryByLocationId(int locationId)
        {
            try
            {
                var summary = await _locationInventoryService.GetSumOfItemInventoryByLocationId(locationId);
                if (summary != null && summary.Any())
                {
                    var summaryDto = _mapper.Map<IEnumerable<LocationInventorySummaryDto>>(summary);
                    AddResponseMessage(Response, LogMessages.LocationInventorySummaryRetrieved, summaryDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.LocationInventorySummaryNotFound);
                    AddResponseMessage(Response, LogMessages.LocationInventorySummaryNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;

        }

        [HttpPatch("updateReorderLevelMaxStockLevel/{locationId}/{itemMasterId}")]
        public async Task<ApiResponseModel> UpdateReorderLevelMaxStockLevel(int locationId, int itemMasterId, UpdateMaxStockReorderLevelRequestModel request)
        {
            try
            {
                var updatedLocationInventory = _mapper.Map<LocationInventory>(request);
                await _locationInventoryService.UpdateReorderLevelMaxStockLevel(locationId, itemMasterId, updatedLocationInventory);
                _logger.LogInformation(LogMessages.LocationInventoryUpdated);
                return AddResponseMessage(Response, LogMessages.LocationInventoryUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetSumLocationInventoriesByLocationIdItemCode")]
        public async Task<ApiResponseModel> GetSumLocationInventoriesByLocationIdItemCode([FromQuery] string itemCode, [FromQuery] int? locationId = null)
        {
            try
            {
                var locationInventorySummary = await _locationInventoryService.GetSumLocationInventoriesByLocationIdItemCode(locationId, itemCode);
                if (locationInventorySummary != null)
                {
                    var locationInventorySummaryDto = _mapper.Map<LocationInventorySummaryDto>(locationInventorySummary);
                    AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventorySummaryDto, true, HttpStatusCode.OK);
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

        [HttpPost("increase-inventory-fifo")]
        public async Task<ApiResponseModel> IncreaseInventoryByFIFO(IncreaseInventoryRequestModel request)
        {
            try
            {
                _logger.LogInformation("++++++++++++++++ Increase-inventory-fifo calling +++++++++++++++++++");
                await _locationInventoryService.IncreaseInventoryByFIFO(request.LocationId, request.ItemMasterId, request.TransactionTypeId, request.Quantity, request.sourceLocationId);

                _logger.LogInformation("Inventory increase successfully using FIFO method");
                AddResponseMessage(Response, "Inventory increase successfully", null, true, HttpStatusCode.OK);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex.Message);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPost("stock-adjustment/{locationInventoryId}/{quantity}")]
        public async Task<ApiResponseModel> StockAdjustment(int locationInventoryId, decimal quantity)
        {
            try
            {
                await _locationInventoryService.StockAdjustment(locationInventoryId, quantity);
                _logger.LogInformation("Stock adjustment completed successfully");
                AddResponseMessage(Response, "Stock adjustment completed successfully", null, true, HttpStatusCode.OK);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex.Message);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.BadRequest);
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
