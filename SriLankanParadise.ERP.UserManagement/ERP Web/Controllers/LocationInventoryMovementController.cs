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
                AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementDtos, true, HttpStatusCode.OK);
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
                AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementDtos, true, HttpStatusCode.OK);
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
                AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementDtos, true, HttpStatusCode.OK);
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
                AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetOnOrBeforeSpecificDate")]
        public async Task<ApiResponseModel> GetOnOrBeforeSpecificDate(DateTime date, int movementTypeId, int transactionTypeId)
        {
            try
            {
                var locationInventoryMovements = await _locationInventoryMovementService.GetOnOrBeforeSpecificDate(date, movementTypeId, transactionTypeId);
                var locationInventoryMovementDtos = _mapper.Map<IEnumerable<LocationInventoryMovementDto>>(locationInventoryMovements);
                AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementDtos, true, HttpStatusCode.OK);
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

                _logger.LogInformation(LogMessages.LocationInventoryMovementUpdated);
                return AddResponseMessage(Response, LogMessages.LocationInventoryMovementUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetUnique/{movementTypeId}/{transactionTypeId}/{itemMasterId}/{batchNo}/{locationId}/{referenceId}")]
        public async Task<ApiResponseModel> GetUnique(int movementTypeId, int transactionTypeId, int itemMasterId, string batchNo, int locationId, int referenceId)
        {
            try
            {
                var locationInventoryMovements = await _locationInventoryMovementService.GetUnique(movementTypeId, transactionTypeId, itemMasterId, batchNo, locationId, referenceId);

                if (locationInventoryMovements != null)
                {
                    var locationInventoryMovementsDto = _mapper.Map<IEnumerable<LocationInventoryMovementDto>>(locationInventoryMovements);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementsDto, true, HttpStatusCode.OK);
                }
                _logger.LogInformation(LogMessages.LocationInventoryMovementsNotFound);
                return AddResponseMessage(Response, LogMessages.LocationInventoryMovementsNotFound, null, true, HttpStatusCode.NotFound);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("ByDateRangeAndTransactionType/{fromDate}/{toDate}/{movementTypeId}/{transactionTypeId}")]
        public async Task<ApiResponseModel> ByDateRangeAndTransactionType(DateTime fromDate, DateTime toDate, int movementTypeId, int transactionTypeId)
        {
            try
            {
                var locationInventoryMovements = await _locationInventoryMovementService.ByDateRangeAndTransactionType(fromDate, toDate, movementTypeId, transactionTypeId);

                if (locationInventoryMovements != null)
                {
                    var locationInventoryMovementsDto = _mapper.Map<IEnumerable<LocationInventoryMovementDto>>(locationInventoryMovements);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementsDto, true, HttpStatusCode.OK);
                }

                locationInventoryMovements = new List<LocationInventoryMovement>();
                _logger.LogInformation(LogMessages.LocationInventoryMovementsNotFound);
                return AddResponseMessage(Response, LogMessages.LocationInventoryMovementsNotFound, locationInventoryMovements, true, HttpStatusCode.NotFound);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetWithoutBatchNo/{movementTypeId}/{transactionTypeId}/{itemMasterId}/{locationId}/{referenceId}")]
        public async Task<ApiResponseModel> GetWithoutBatchNo(int movementTypeId, int transactionTypeId, int itemMasterId, int locationId, int referenceId)
        {
            try
            {
                var locationInventoryMovements = await _locationInventoryMovementService.GetWithoutBatchNo(movementTypeId, transactionTypeId, itemMasterId, locationId, referenceId);

                if (locationInventoryMovements != null)
                {
                    var locationInventoryMovementsDto = _mapper.Map<IEnumerable<LocationInventoryMovementDto>>(locationInventoryMovements);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementsDto, true, HttpStatusCode.OK);
                }

                locationInventoryMovements = new List<LocationInventoryMovement>();
                _logger.LogInformation(LogMessages.LocationInventoryMovementsNotFound);
                return AddResponseMessage(Response, LogMessages.LocationInventoryMovementsNotFound, locationInventoryMovements, true, HttpStatusCode.NotFound);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetUnique/{movementTypeId}/{transactionTypeId}/{itemMasterId}/{batchNo}/{locationId}/{fromDate}/{toDate}")]
        public async Task<ApiResponseModel> GetWithoutReferenceNo(int movementTypeId, int transactionTypeId, int itemMasterId, string batchNo, int locationId, DateTime fromDate, DateTime toDate)
        {
            try
            {
                var locationInventoryMovements = await _locationInventoryMovementService.GetWithoutReferenceNo(movementTypeId, transactionTypeId, itemMasterId, batchNo, locationId, fromDate, toDate);

                if (locationInventoryMovements != null)
                {
                    var locationInventoryMovementsDto = _mapper.Map<IEnumerable<LocationInventoryMovementDto>>(locationInventoryMovements);
                    return AddResponseMessage(Response, LogMessages.LocationInventoryMovementsRetrieved, locationInventoryMovementsDto, true, HttpStatusCode.OK);
                }
                _logger.LogInformation(LogMessages.LocationInventoryMovementsNotFound);
                return AddResponseMessage(Response, LogMessages.LocationInventoryMovementsNotFound, null, true, HttpStatusCode.NotFound);
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
