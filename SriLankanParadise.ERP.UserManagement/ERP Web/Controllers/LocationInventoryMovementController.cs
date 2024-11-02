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
    [Route("api/locationInventoryMovement")]
    public class LocationInventoryMovementController : BaseApiController
    {
        private readonly ILocationInventoryMovementService _locationInventoryMovementService;
        private readonly IItemMasterService _itemMasterService;
        private readonly ILocationService _locationService;
        private readonly ILocationInventoryService _locationInventoryService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationInventoryMovementController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationInventoryMovementController(
            ILocationInventoryMovementService locationInventoryMovementService,
            IItemMasterService itemMasterService,
            ILocationService locationService,
            ILocationInventoryService locationInventoryService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationInventoryMovementController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _locationInventoryMovementService = locationInventoryMovementService;
            _itemMasterService = itemMasterService;
            _locationService = locationService;
            _locationInventoryService = locationInventoryService;
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

        [HttpGet("{IssueMasterId}")]
        public async Task<ApiResponseModel> Get(int IssueMasterId)
        {
            try
            {
                var locationInventoryMovements = await _locationInventoryMovementService.Get(IssueMasterId);
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

        [HttpGet("{itemMasterId}/{referenceNo}/{movementTypeId}")]
        public async Task<ApiResponseModel> Get(int itemMasterId, int referenceNo, int movementTypeId)
        {
            try
            {
                var locationInventoryMovements = await _locationInventoryMovementService.Get(itemMasterId, referenceNo, movementTypeId);
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

        [HttpGet("ByWorkOrder/{workOrderId}")]
        public async Task<ApiResponseModel> ByWorkOrder(int workOrderId)
        {
            try
            {
                var locationInventoryMovements = await _locationInventoryMovementService.ByWorkOrder(workOrderId);
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

        [HttpGet("ByDateRange")]
        public async Task<ApiResponseModel> ByDateRange(DateTime fromDate, DateTime toDate)
        {
            try
            {
                var locationInventoryAnalysisReportList = new List<InventoryAnalysisReportDto>();
                // Call the service method to get location inventory movements by date range
                var locationInventoryMovements = await _locationInventoryMovementService.ByDateRange(fromDate, toDate);

                foreach (var item in locationInventoryMovements)
                {
                    var itemMaster = await _itemMasterService.GetItemMasterByItemMasterId(item.ItemMasterId);
                    var location = await _locationService.GetLocationByLocationId(item.LocationId);

                    // Calculate ReceivedQty and ActualUsage
                    var receivedQty = locationInventoryMovements
                                        .Where(l => l.ItemMasterId == item.ItemMasterId &&
                                                    l.BatchNo == item.BatchNo &&
                                                    l.LocationId == item.LocationId &&
                                                    l.TransactionTypeId == 4)
                                        .Sum(l => l.Qty);

                    var actualUsage = locationInventoryMovements
                                        .Where(l => l.ItemMasterId == item.ItemMasterId &&
                                                    l.BatchNo == item.BatchNo &&
                                                    l.LocationId == item.LocationId &&
                                                    l.TransactionTypeId == 8)
                                        .Sum(l => l.Qty);


                    var locationInventory = await _locationInventoryService.GetLocationInventoriesByLocationId(item.LocationId);

                    var closingBalance = locationInventory?.Where(l => l.BatchNo == item.BatchNo &&
                        l.LocationId == item.LocationId &&
                        l.ItemMasterId == item.ItemMasterId).FirstOrDefault()?.StockInHand ?? 0;

                    // Create the InventoryAnalysisReportDto
                    var locationInventoryAnalysisReport = new InventoryAnalysisReportDto()
                    {
                        Inventory = location.LocationName,
                        RawMaterial = itemMaster.ItemName,
                        UOM = itemMaster.Unit.UnitName,
                        BatchNo = item.BatchNo,
                        OpeningBalance = (double)(closingBalance + actualUsage - receivedQty),
                        ReceivedQty = (double)receivedQty, // Set ReceivedQty
                        ActualUsage = (double)actualUsage, // Set ActualUsage
                        ClosingBalance = (double)closingBalance,

                    };
                    locationInventoryAnalysisReportList.Add(locationInventoryAnalysisReport);
                }

                // Map the result to DTOs
                //var locationInventoryMovementDtos = _mapper.Map<IEnumerable<LocationInventoryMovementDto>>(locationInventoryMovements);

                // Add a successful response message
                AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventoryAnalysisReportList, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                // Log the error and add an error response message
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        [HttpGet("ByDateRangeAndMovementType")]
        public async Task<ApiResponseModel> ByDateRange(DateTime fromDate, DateTime toDate, int movementTypeId)
        {
            try
            {
                var locationInventoryAnalysisReportList = new List<InventoryAnalysisReportDto>();
                // Call the service method to get location inventory movements by date range
                var locationInventoryMovements = await _locationInventoryMovementService.ByDateRange(fromDate, toDate, movementTypeId);

                foreach (var item in locationInventoryMovements)
                {
                    var itemMaster = await _itemMasterService.GetItemMasterByItemMasterId(item.ItemMasterId);
                    var location = await _locationService.GetLocationByLocationId(item.LocationId);

                    // Calculate ReceivedQty and ActualUsage
                    var receivedQty = locationInventoryMovements
                                        .Where(l => l.ItemMasterId == item.ItemMasterId &&
                                                    l.BatchNo == item.BatchNo &&
                                                    l.LocationId == item.LocationId &&
                                                    l.TransactionTypeId == 4)
                                        .Sum(l => l.Qty);

                    var actualUsage = locationInventoryMovements
                                        .Where(l => l.ItemMasterId == item.ItemMasterId &&
                                                    l.BatchNo == item.BatchNo &&
                                                    l.LocationId == item.LocationId &&
                                                    l.TransactionTypeId == 8)
                                        .Sum(l => l.Qty);


                    var locationInventory = await _locationInventoryService.GetLocationInventoriesByLocationId(item.LocationId);

                    var closingBalance = locationInventory?.Where(l => l.BatchNo == item.BatchNo &&
                        l.LocationId == item.LocationId &&
                        l.ItemMasterId == item.ItemMasterId).FirstOrDefault()?.StockInHand ?? 0;

                    // Create the InventoryAnalysisReportDto
                    var locationInventoryAnalysisReport = new InventoryAnalysisReportDto()
                    {
                        Inventory = location.LocationName,
                        RawMaterial = itemMaster.ItemName,
                        UOM = itemMaster.Unit.UnitName,
                        BatchNo = item.BatchNo,
                        OpeningBalance = (double)(closingBalance + actualUsage - receivedQty),
                        ReceivedQty = (double)receivedQty, // Set ReceivedQty
                        ActualUsage = (double)actualUsage, // Set ActualUsage
                        ClosingBalance = (double)closingBalance,

                    };
                    locationInventoryAnalysisReportList.Add(locationInventoryAnalysisReport);
                }

                // Map the result to DTOs
                //var locationInventoryMovementDtos = _mapper.Map<IEnumerable<LocationInventoryMovementDto>>(locationInventoryMovements);

                // Add a successful response message
                AddResponseMessage(Response, LogMessages.LocationInventoriesRetrieved, locationInventoryAnalysisReportList, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                // Log the error and add an error response message
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

        [HttpGet("GetByBatchNumber/{movementTypeId}/{itemMasterId}/{batchNo}")]
        public async Task<ApiResponseModel> Get(int movementTypeId, int itemMasterId, string batchNo)
        {
            try
            {
                var locationInventoryMovement = await _locationInventoryMovementService.Get(movementTypeId, itemMasterId, batchNo);

                if (locationInventoryMovement != null)
                {
                    var locationInventoryMovementDto = _mapper.Map<LocationInventoryMovementDto>(locationInventoryMovement);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryMovementRetrieved, locationInventoryMovementDto, true, HttpStatusCode.OK);
                }
                _logger.LogInformation(LogMessages.LocationInventoryMovementNotFound);
                return AddResponseMessage(Response, LogMessages.LocationInventoryMovementNotFound, null, true, HttpStatusCode.NotFound);
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
