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
    [Route("api/salesInvoiceDetail")]
    public class SalesInvoiceDetailController : BaseApiController
    {
        private readonly ISalesInvoiceDetailService _salesInvoiceDetailService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SalesInvoiceDetailController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SalesInvoiceDetailController(
            ISalesInvoiceDetailService salesInvoiceDetailService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SalesInvoiceDetailController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _salesInvoiceDetailService = salesInvoiceDetailService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSalesInvoiceDetail(SalesInvoiceDetailRequestModel salesInvoiceDetailRequest)
        {
            try
            {
                var salesInvoiceDetail = _mapper.Map<SalesInvoiceDetail>(salesInvoiceDetailRequest);
                await _salesInvoiceDetailService.AddSalesInvoiceDetail(salesInvoiceDetail);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = salesInvoiceDetailRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var salesInvoiceDetailDto = _mapper.Map<SalesInvoiceDetailDto>(salesInvoiceDetail);
                _logger.LogInformation(LogMessages.SalesInvoiceDetailCreated);
                AddResponseMessage(Response, LogMessages.SalesInvoiceDetailCreated, salesInvoiceDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{salesInvoiceDetailId}")]
        public async Task<ApiResponseModel> UpdateSalesInvoiceDetail(int salesInvoiceDetailId, SalesInvoiceDetailRequestModel salesInvoiceDetailRequest)
        {
            try
            {
                var existingSalesInvoiceDetail = await _salesInvoiceDetailService.GetSalesInvoiceDetailBySalesInvoiceDetailId(salesInvoiceDetailId);
                if (existingSalesInvoiceDetail == null)
                {
                    _logger.LogWarning(LogMessages.SalesInvoiceDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesInvoiceDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSalesInvoiceDetail = _mapper.Map<SalesInvoiceDetail>(salesInvoiceDetailRequest);
                updatedSalesInvoiceDetail.SalesInvoiceDetailId = salesInvoiceDetailId; // Ensure the ID is not changed

                await _salesInvoiceDetailService.UpdateSalesInvoiceDetail(existingSalesInvoiceDetail.SalesInvoiceDetailId, updatedSalesInvoiceDetail);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = salesInvoiceDetailRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesInvoiceDetailUpdated);
                return AddResponseMessage(Response, LogMessages.SalesInvoiceDetailUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{salesInvoiceDetailId}")]
        public async Task<ApiResponseModel> DeleteSalesInvoiceDetail(int salesInvoiceDetailId)
        {
            try
            {
                var existingSalesInvoiceDetail = await _salesInvoiceDetailService.GetSalesInvoiceDetailBySalesInvoiceDetailId(salesInvoiceDetailId);
                if (existingSalesInvoiceDetail == null)
                {
                    _logger.LogWarning(LogMessages.SalesInvoiceDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesInvoiceDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _salesInvoiceDetailService.DeleteSalesInvoiceDetail(salesInvoiceDetailId);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = 32,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesInvoiceDetailDeleted);
                return AddResponseMessage(Response, LogMessages.SalesInvoiceDetailDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
