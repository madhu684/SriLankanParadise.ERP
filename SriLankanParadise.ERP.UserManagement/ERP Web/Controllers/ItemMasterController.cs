﻿using AutoMapper;
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
    [Route("api/itemMaster")]
    public class ItemMasterController : BaseApiController
    {
        private readonly IItemMasterService _itemMasterService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ItemMasterController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ItemMasterController(
            IItemMasterService itemMasterService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ItemMasterController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _itemMasterService = itemMasterService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddItemMaster(ItemMasterRequestModel itemMasterRequest)
        {
            try
            {
                var itemMaster = _mapper.Map<ItemMaster>(itemMasterRequest);
                await _itemMasterService.AddItemMaster(itemMaster);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = itemMasterRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

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
                var actionLog = new ActionLogModel()
                {
                    ActionId = itemMasterRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

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
                var actionLog = new ActionLogModel()
                {
                    ActionId = 8,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ItemMasterDeleted);
                return AddResponseMessage(Response, LogMessages.ItemMasterDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}