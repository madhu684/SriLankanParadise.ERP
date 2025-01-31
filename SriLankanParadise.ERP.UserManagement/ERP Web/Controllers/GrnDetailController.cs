﻿using AutoMapper;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using SriLankanParadise.ERP.UserManagement.Business_Service;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/grnDetail")]
    public class GrnDetailController : BaseApiController
    {
        private readonly IGrnDetailService _grnDetailService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<GrnDetailController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GrnDetailController(
            IGrnDetailService grnDetailService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<GrnDetailController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _grnDetailService = grnDetailService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddGrnDetail(GrnDetailRequestModel grnDetailRequest)
        {
            try
            {
                var grnDetail = _mapper.Map<GrnDetail>(grnDetailRequest);
                await _grnDetailService.AddGrnDetail(grnDetail);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = grnDetailRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var grnDetailDto = _mapper.Map<GrnDetailDto>(grnDetail);
                _logger.LogInformation(LogMessages.GrnDetailCreated);
                AddResponseMessage(Response, LogMessages.GrnDetailCreated, grnDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{grnDetailId}")]
        public async Task<ApiResponseModel> UpdateGrnDetail(int grnDetailId, GrnDetailRequestModel grnDetailRequest)
        {
            try
            {
                var existingGrnDetail = await _grnDetailService.GetGrnDetailByGrnDetailId(grnDetailId);
                if (existingGrnDetail == null)
                {
                    _logger.LogWarning(LogMessages.GrnDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.GrnDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedGrnDetail = _mapper.Map<GrnDetail>(grnDetailRequest);
                updatedGrnDetail.GrnDetailId = grnDetailId; // Ensure the ID is not changed

                await _grnDetailService.UpdateGrnDetail(existingGrnDetail.GrnDetailId, updatedGrnDetail);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = grnDetailRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.GrnDetailUpdated);
                return AddResponseMessage(Response, LogMessages.GrnDetailUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{grnDetailId}")]
        public async Task<ApiResponseModel> DeleteGrnDetail(int grnDetailId)
        {
            try
            {
                var existingGrnDetail = await _grnDetailService.GetGrnDetailByGrnDetailId(grnDetailId);
                if (existingGrnDetail == null)
                {
                    _logger.LogWarning(LogMessages.GrnDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.GrnDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _grnDetailService.DeleteGrnDetail(grnDetailId);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = 23,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.GrnDetailDeleted);
                return AddResponseMessage(Response, LogMessages.GrnDetailDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
