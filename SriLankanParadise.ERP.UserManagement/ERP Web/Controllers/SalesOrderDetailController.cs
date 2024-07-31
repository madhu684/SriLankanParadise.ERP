using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using SriLankanParadise.ERP.UserManagement.Business_Service;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/salesOrderDetail")]
    public class SalesOrderDetailController : BaseApiController
    {
        private readonly ISalesOrderDetailService _salesOrderDetailService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SalesOrderDetailController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SalesOrderDetailController(
            ISalesOrderDetailService salesOrderDetailService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SalesOrderDetailController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _salesOrderDetailService = salesOrderDetailService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSalesOrderDetail(SalesOrderDetailRequestModel salesOrderDetailRequest)
        {
            try
            {
                var salesOrderDetail = _mapper.Map<SalesOrderDetail>(salesOrderDetailRequest);
                await _salesOrderDetailService.AddSalesOrderDetail(salesOrderDetail);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = salesOrderDetailRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var salesOrderDetailDto = _mapper.Map<SalesOrderDetailDto>(salesOrderDetail);
                _logger.LogInformation(LogMessages.SalesOrderDetailCreated);
                AddResponseMessage(Response, LogMessages.SalesOrderDetailCreated, salesOrderDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{salesOrderDetailId}")]
        public async Task<ApiResponseModel> UpdateSalesOrderDetail(int salesOrderDetailId, SalesOrderDetailRequestModel salesOrderDetailRequest)
        {
            try
            {
                var existingSalesOrderDetail = await _salesOrderDetailService.GetSalesOrderDetailBySalesOrderDetailId(salesOrderDetailId);
                if (existingSalesOrderDetail == null)
                {
                    _logger.LogWarning(LogMessages.SalesOrderDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesOrderDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSalesOrderDetail = _mapper.Map<SalesOrderDetail>(salesOrderDetailRequest);
                updatedSalesOrderDetail.SalesOrderDetailId = salesOrderDetailId; // Ensure the ID is not changed

                await _salesOrderDetailService.UpdateSalesOrderDetail(existingSalesOrderDetail.SalesOrderDetailId, updatedSalesOrderDetail);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = salesOrderDetailRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesOrderDetailUpdated);
                return AddResponseMessage(Response, LogMessages.SalesOrderDetailUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{salesOrderDetailId}")]
        public async Task<ApiResponseModel> DeleteSalesOrderDetail(int salesOrderDetailId)
        {
            try
            {
                var existingSalesOrderDetail = await _salesOrderDetailService.GetSalesOrderDetailBySalesOrderDetailId(salesOrderDetailId);
                if (existingSalesOrderDetail == null)
                {
                    _logger.LogWarning(LogMessages.SalesOrderDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesOrderDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _salesOrderDetailService.DeleteSalesOrderDetail(salesOrderDetailId);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = 28,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesOrderDetailDeleted);
                return AddResponseMessage(Response, LogMessages.SalesOrderDetailDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
