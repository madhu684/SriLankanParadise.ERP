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
    [Route("api/dailyStockBalance")]
    public class DailyStockBalanceController : BaseApiController
    {
        private readonly IDailyStockBalanceService _dailyStockBalanceService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<DailyStockBalanceController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DailyStockBalanceController(
            IDailyStockBalanceService dailyStockBalanceService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<DailyStockBalanceController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _dailyStockBalanceService = dailyStockBalanceService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddDailyStockBalance(DailyStockBalanceRequestModel dailyStockBalanceRequest)
        {
            try
            {
                var dailyStockBalance = _mapper.Map<DailyStockBalance>(dailyStockBalanceRequest);
                await _dailyStockBalanceService.AddDailyStockBalance(dailyStockBalance);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = dailyStockBalanceRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var dailyStockBalanceDto = _mapper.Map<DailyStockBalanceDto>(dailyStockBalance);
                _logger.LogInformation(LogMessages.DailyStockBalanceCreated);
                AddResponseMessage(Response, LogMessages.DailyStockBalanceCreated, dailyStockBalanceDto, true, HttpStatusCode.Created);
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
                var dailyStockBalances = await _dailyStockBalanceService.GetAll();
                var dailyStockBalanceDtos = _mapper.Map<IEnumerable<DailyStockBalanceDto>>(dailyStockBalances);
                AddResponseMessage(Response, LogMessages.DailyStockBalancesRetrieved, dailyStockBalanceDtos, true, HttpStatusCode.OK);
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
