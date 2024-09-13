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
using System.Transactions;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/itemMaster")]
    public class ItemMasterController : BaseApiController
    {
        private readonly IItemMasterService _itemMasterService;
        private readonly ISubItemMasterService _subItemMasterService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ItemMasterController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ItemMasterController(
            IItemMasterService itemMasterService,
            ISubItemMasterService subItemMasterService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ItemMasterController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _itemMasterService = itemMasterService;
            _subItemMasterService = subItemMasterService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddItemMaster(ItemMasterRequestModel itemMasterRequest)
        {
            //using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            try
            {
                var itemMaster = _mapper.Map<ItemMaster>(itemMasterRequest);
                await _itemMasterService.AddItemMaster(itemMaster);

                // Save each SubItems
                foreach (var subItemRequest in itemMasterRequest.SubItems)
                {
                    var subItemMaster = _mapper.Map<SubItemMaster>(subItemRequest);
                    subItemMaster.ItemMasterId = itemMaster.ItemMasterId; // Set the parent ItemMasterId
                    await _subItemMasterService.AddSubItemMaster(subItemMaster);
                }

                //transaction.Complete();

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = itemMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var itemMasterDto = _mapper.Map<ItemMasterDto>(itemMaster);
                _logger.LogInformation(LogMessages.ItemMasterCreated);
                AddResponseMessage(Response, LogMessages.ItemMasterCreated, itemMasterDto, true, HttpStatusCode.Created);
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
                var itemMasters = await _itemMasterService.GetAll();
                var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemMastersByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetItemMastersByCompanyId(int companyId)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetItemMastersByCompanyId(companyId);
                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemMastersByCompanyIdWithQuery/{companyId}")]
        public async Task<ApiResponseModel> GetItemMastersByCompanyId(int companyId, string? searchQuery = null, string? itemType = null)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetItemMastersByCompanyId(companyId, searchQuery, itemType);

                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPut("{itemMasterId}")]
        public async Task<ApiResponseModel> UpdateItemMaster(int itemMasterId, ItemMasterRequestModel itemMasterRequest)
        {
            try
            {
                var existingItemMaster = await _itemMasterService.GetItemMasterByItemMasterId(itemMasterId);
                if (existingItemMaster == null)
                {
                    _logger.LogWarning(LogMessages.ItemMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.ItemMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedItemMaster = _mapper.Map<ItemMaster>(itemMasterRequest);
                updatedItemMaster.ItemMasterId = itemMasterId; // Ensure the ID is not changed

                await _itemMasterService.UpdateItemMaster(existingItemMaster.ItemMasterId, updatedItemMaster);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = itemMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ItemMasterUpdated);
                return AddResponseMessage(Response, LogMessages.ItemMasterUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{itemMasterId}")]
        public async Task<ApiResponseModel> DeleteItemMaster(int itemMasterId)
        {
            try
            {
                var existingItemMaster = await _itemMasterService.GetItemMasterByItemMasterId(itemMasterId);
                if (existingItemMaster == null)
                {
                    _logger.LogWarning(LogMessages.ItemMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.ItemMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _itemMasterService.DeleteItemMaster(itemMasterId);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = 1041,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ItemMasterDeleted);
                return AddResponseMessage(Response, LogMessages.ItemMasterDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetItemMastersByUserId/{userId}")]
        public async Task<ApiResponseModel> GetItemMastersByUserId(int userId)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetItemMastersByUserId(userId);
                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemMasterByItemMasterId/{itemMasterId}")]
        public async Task<ApiResponseModel> GetItemMasterByItemMasterId(int itemMasterId)
        {
            try
            {
                var itemMaster = await _itemMasterService.GetItemMasterByItemMasterId(itemMasterId);
                if (itemMaster != null)
                {
                    var itemMasterDto = _mapper.Map<ItemMasterDto>(itemMaster);
                    AddResponseMessage(Response, LogMessages.ItemMasterRetrieved, itemMasterDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMasterNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMasterNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetSubItemsByItemMasterId/{itemMasterId}")]
        public async Task<ApiResponseModel> GetSubItemsByItemMasterId(int itemMasterId)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetSubItemsByItemMasterId(itemMasterId);
                if (itemMasters != null)
                {
                    var itemMasterDtos= _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.SubItemsRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SubItemsNotFound);
                    AddResponseMessage(Response, LogMessages.SubItemsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemMastersByItemMasterIds")]
        public async Task<ApiResponseModel> GetItemMastersByItemMasterIds([FromQuery] int[] itemMasterIds)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetItemMastersByItemMasterIds(itemMasterIds);
                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
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
