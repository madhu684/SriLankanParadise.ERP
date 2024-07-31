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
    [Route("api/salesReceiptSalesInvoice")]
    public class SalesReceiptSalesInvoiceController : BaseApiController
    {
        private readonly ISalesReceiptSalesInvoiceService _salesReceiptSalesInvoiceService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SalesReceiptSalesInvoiceController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SalesReceiptSalesInvoiceController(
            ISalesReceiptSalesInvoiceService salesReceiptSalesInvoiceService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SalesReceiptSalesInvoiceController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _salesReceiptSalesInvoiceService = salesReceiptSalesInvoiceService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSalesReceiptSalesInvoice(SalesReceiptSalesInvoiceRequestModel salesReceiptSalesInvoiceRequest)
        {
            try
            {
                var salesReceiptSalesInvoice = _mapper.Map<SalesReceiptSalesInvoice>(salesReceiptSalesInvoiceRequest);
                await _salesReceiptSalesInvoiceService.AddSalesReceiptSalesInvoice(salesReceiptSalesInvoice);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = salesReceiptSalesInvoiceRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var salesReceiptSalesInvoiceDto = _mapper.Map<SalesReceiptSalesInvoiceDto>(salesReceiptSalesInvoice);
                _logger.LogInformation(LogMessages.SalesReceiptSalesInvoiceCreated);
                AddResponseMessage(Response, LogMessages.SalesReceiptSalesInvoiceCreated, salesReceiptSalesInvoiceDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{salesReceiptSalesInvoiceId}")]
        public async Task<ApiResponseModel> UpdateSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId, SalesReceiptSalesInvoiceRequestModel salesReceiptSalesInvoiceRequest)
        {
            try
            {
                var existingSalesReceiptSalesInvoice = await _salesReceiptSalesInvoiceService.GetSalesReceiptSalesInvoiceBySalesReceiptSalesInvoiceId(salesReceiptSalesInvoiceId);
                if (existingSalesReceiptSalesInvoice == null)
                {
                    _logger.LogWarning(LogMessages.SalesReceiptSalesInvoiceNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesReceiptSalesInvoiceNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSalesReceiptSalesInvoice = _mapper.Map<SalesReceiptSalesInvoice>(salesReceiptSalesInvoiceRequest);
                updatedSalesReceiptSalesInvoice.SalesReceiptSalesInvoiceId = salesReceiptSalesInvoiceId; // Ensure the ID is not changed

                await _salesReceiptSalesInvoiceService.UpdateSalesReceiptSalesInvoice(existingSalesReceiptSalesInvoice.SalesReceiptSalesInvoiceId, updatedSalesReceiptSalesInvoice);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = salesReceiptSalesInvoiceRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesReceiptSalesInvoiceUpdated);
                return AddResponseMessage(Response, LogMessages.SalesReceiptSalesInvoiceUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{salesReceiptSalesInvoiceId}")]
        public async Task<ApiResponseModel> DeleteSalesReceiptSalesInvoice(int salesReceiptSalesInvoiceId)
        {
            try
            {
                var existingSalesReceiptSalesInvoice = await _salesReceiptSalesInvoiceService.GetSalesReceiptSalesInvoiceBySalesReceiptSalesInvoiceId(salesReceiptSalesInvoiceId);
                if (existingSalesReceiptSalesInvoice == null)
                {
                    _logger.LogWarning(LogMessages.SalesReceiptSalesInvoiceNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesReceiptSalesInvoiceNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _salesReceiptSalesInvoiceService.DeleteSalesReceiptSalesInvoice(salesReceiptSalesInvoiceId);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = 1035,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesReceiptSalesInvoiceDeleted);
                return AddResponseMessage(Response, LogMessages.SalesReceiptSalesInvoiceDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
