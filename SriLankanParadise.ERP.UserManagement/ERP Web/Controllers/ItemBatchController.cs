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
    [Route("api/itemBatch")]
    public class ItemBatchController : BaseApiController
    {
        private readonly IItemBatchService _itemBatchService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ItemBatchController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ItemBatchController(
            IItemBatchService itemBatchService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ItemBatchController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _itemBatchService = itemBatchService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddItemBatch(ItemBatchRequestModel itemBatchRequest)
        {
            try
            {
                var itemBatch = _mapper.Map<ItemBatch>(itemBatchRequest);
                await _itemBatchService.AddItemBatch(itemBatch);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = itemBatchRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var itemBatchDto = _mapper.Map<ItemBatchDto>(itemBatch);
                _logger.LogInformation(LogMessages.ItemBatchCreated);
                AddResponseMessage(Response, LogMessages.ItemBatchCreated, itemBatchDto, true, HttpStatusCode.Created);
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
                var itemBatches = await _itemBatchService.GetAll();
                var itemBatchDtos = _mapper.Map<IEnumerable<ItemBatchDto>>(itemBatches);
                AddResponseMessage(Response, LogMessages.ItemBatchesRetrieved, itemBatchDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemBatchesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetItemBatchesByCompanyId(int companyId)
        {
            try
            {
                var itemBatches = await _itemBatchService.GetItemBatchesByCompanyId(companyId);
                if (itemBatches != null)
                {
                    var itemBatchDtos = _mapper.Map<IEnumerable<ItemBatchDto>>(itemBatches);
                    AddResponseMessage(Response, LogMessages.ItemBatchesRetrieved, itemBatchDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemBatchesNotFound);
                    AddResponseMessage(Response, LogMessages.ItemBatchesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetItemBatchesByUserId/{userId}")]
        public async Task<ApiResponseModel> GetItemBatchesByUserId(int userId)
        {
            try
            {
                var itemBatches = await _itemBatchService.GetItemBatchesByUserId(userId);
                if (itemBatches != null)
                {
                    var itemBatchDtos = _mapper.Map<IEnumerable<ItemBatchDto>>(itemBatches);
                    AddResponseMessage(Response, LogMessages.ItemBatchesRetrieved, itemBatchDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemBatchesNotFound);
                    AddResponseMessage(Response, LogMessages.ItemBatchesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemBatchesByItemMasterId")]
        public async Task<ApiResponseModel> GetItemBatchesByItemMasterId(int itemMasterId, int companyId)
        {
            try
            {
                var itemBatches = await _itemBatchService.GetItemBatchesByItemMasterId(itemMasterId, companyId);
                if (itemBatches != null)
                {
                    var itemBatchDtos = _mapper.Map<IEnumerable<ItemBatchDto>>(itemBatches);
                    AddResponseMessage(Response, LogMessages.ItemBatchesRetrieved, itemBatchDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemBatchesNotFound);
                    AddResponseMessage(Response, LogMessages.ItemBatchesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemBatchesByLocationIdCompanyId/{locationId}/{companyId}")]
        public async Task<ApiResponseModel> GetItemBatchesByLocationIdCompanyId(int locationId, int companyId)
        {
            try
            {
                var itemBatches = await _itemBatchService.GetItemBatchesByLocationIdCompanyId(locationId, companyId);
                if (itemBatches != null)
                {
                    var itemBatchDtos = _mapper.Map<IEnumerable<ItemBatchDto>>(itemBatches);
                    AddResponseMessage(Response, LogMessages.ItemBatchesRetrieved, itemBatchDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemBatchesNotFound);
                    AddResponseMessage(Response, LogMessages.ItemBatchesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{batchId}/{itemMasterId}")]
        public async Task<ApiResponseModel> UpdateItemBatch(int batchId, int itemMasterId, ItemBatchRequestModel itemBatchRequest)
        {
            try
            {
                var existingItemBatch = await _itemBatchService.GetItemBatchByBatchIdAndItemMasterId(batchId, itemMasterId);
                if (existingItemBatch == null)
                {
                    _logger.LogWarning(LogMessages.ItemBatchNotFound);
                    return AddResponseMessage(Response, LogMessages.ItemBatchNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedItemBatch = _mapper.Map<ItemBatch>(itemBatchRequest);
                updatedItemBatch.BatchId = batchId; // Ensure the ID is not changed
                updatedItemBatch.ItemMasterId = itemMasterId;

                await _itemBatchService.UpdateItemBatch(existingItemBatch.BatchId, existingItemBatch.ItemMasterId, updatedItemBatch);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = itemBatchRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ItemBatchUpdated);
                return AddResponseMessage(Response, LogMessages.ItemBatchUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPatch("updateQty/{batchId}/{itemMasterId}/{operation}")]
        public async Task<ApiResponseModel> UpdateItemBatchQty(int batchId, int itemMasterId, string operation, UpdateItemBatchQtyRequestModel itemBatchQtyRequest)
        {
            try
            {
                var existingItemBatch = await _itemBatchService.GetItemBatchByBatchIdAndItemMasterId(batchId, itemMasterId);
                if (existingItemBatch == null)
                {
                    _logger.LogWarning(LogMessages.ItemBatchNotFound);
                    return AddResponseMessage(Response, LogMessages.ItemBatchNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedItemBatch = _mapper.Map<ItemBatch>(itemBatchQtyRequest);
                updatedItemBatch.BatchId = batchId; // Ensure the ID is not changed
                updatedItemBatch.ItemMasterId = itemMasterId;

                await _itemBatchService.UpdateItemBatchQty(existingItemBatch.BatchId, existingItemBatch.ItemMasterId, updatedItemBatch, operation);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = itemBatchQtyRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ItemBatchUpdated);
                return AddResponseMessage(Response, LogMessages.ItemBatchUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetItemBatchByItemMasterIdBatchId/{itemMasterId}/{batchId}")]
        public async Task<ApiResponseModel> GetItemBatchByItemMasterIdBatchId(int itemMasterId, int batchId)
        {
            try
            {
                var itemBatch = await _itemBatchService.GetItemBatchByItemMasterIdBatchId(itemMasterId, batchId);
                if (itemBatch != null)
                {
                    var itemBatchDto = _mapper.Map<ItemBatchDto>(itemBatch);
                    AddResponseMessage(Response, LogMessages.ItemBatchRetrieved, itemBatchDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemBatchNotFound);
                    AddResponseMessage(Response, LogMessages.ItemBatchNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetUniqueItembatchRef/{locationId}/{companyId}")]
        public async Task<ApiResponseModel> GetUniqueItembatchRef(int locationId, int companyId)
        {
            try
            {
                var itemBatches = await _itemBatchService.GetUniqueItembatchRef(locationId, companyId);
                if (itemBatches != null)
                {
                    AddResponseMessage(Response, LogMessages.ItemBatchesRetrieved, itemBatches, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemBatchesNotFound);
                    AddResponseMessage(Response, LogMessages.ItemBatchesNotFound, null, true, HttpStatusCode.NotFound);
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
