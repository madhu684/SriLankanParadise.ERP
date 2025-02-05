﻿using System.Net;
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
    [Route("api/purchaseOrderDetail")]
    public class PurchaseOrderDetailController :BaseApiController
    {
        private readonly IPurchaseOrderDetailService _purchaseOrderDetailService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<PurchaseOrderDetailController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PurchaseOrderDetailController(
            IPurchaseOrderDetailService purchaseOrderDetailService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<PurchaseOrderDetailController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _purchaseOrderDetailService = purchaseOrderDetailService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddPurchaseOrderDetail(PurchaseOrderDetailRequestModel purchaseOrderDetailRequest)
        {
            try
            {
                var purchaseOrderDetail = _mapper.Map<PurchaseOrderDetail>(purchaseOrderDetailRequest);
                await _purchaseOrderDetailService.AddPurchaseOrderDetail(purchaseOrderDetail);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = purchaseOrderDetailRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var purchaseOrderDetailDto = _mapper.Map<PurchaseOrderDetailDto>(purchaseOrderDetail);
                _logger.LogInformation(LogMessages.PurchaseOrderDetailCreated);
                AddResponseMessage(Response, LogMessages.PurchaseOrderDetailCreated, purchaseOrderDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{purchaseOrderDetailId}")]
        public async Task<ApiResponseModel> UpdatePurchaseOrderDetail(int purchaseOrderDetailId, PurchaseOrderDetailRequestModel purchaseOrderDetailRequest)
        {
            try
            {
                var existingPurchaseOrderDetail = await _purchaseOrderDetailService.GetPurchaseOrderDetailByPurchaseOrderDetailId(purchaseOrderDetailId);
                if (existingPurchaseOrderDetail == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseOrderDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseOrderDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedPurchaseOrderDetail = _mapper.Map<PurchaseOrderDetail>(purchaseOrderDetailRequest);
                updatedPurchaseOrderDetail.PurchaseOrderDetailId = purchaseOrderDetailId; // Ensure the ID is not changed

                await _purchaseOrderDetailService.UpdatePurchaseOrderDetail(existingPurchaseOrderDetail.PurchaseOrderDetailId, updatedPurchaseOrderDetail);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = purchaseOrderDetailRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.PurchaseOrderDetailUpdated);
                return AddResponseMessage(Response, LogMessages.PurchaseOrderDetailUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{purchaseOrderDetailId}")]
        public async Task<ApiResponseModel> DeletePurchaseOrderDetail(int purchaseOrderDetailId)
        {
            try
            {
                var existingPurchaseOrderDetail = await _purchaseOrderDetailService.GetPurchaseOrderDetailByPurchaseOrderDetailId(purchaseOrderDetailId);
                if (existingPurchaseOrderDetail == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseOrderDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseOrderDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _purchaseOrderDetailService.DeletePurchaseOrderDetail(purchaseOrderDetailId);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = 19,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.PurchaseOrderDetailDeleted);
                return AddResponseMessage(Response, LogMessages.PurchaseOrderDetailDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
