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
    [Route("api/salesInvoice")]
    public class SalesInvoiceController : BaseApiController
    {
        private readonly ISalesInvoiceService _salesInvoiceService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SalesInvoiceController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SalesInvoiceController(
            ISalesInvoiceService salesInvoiceService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SalesInvoiceController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _salesInvoiceService = salesInvoiceService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSalesInvoice(SalesInvoiceRequestModel salesInvoiceRequest)
        {
            try
            {
                var salesInvoice = _mapper.Map<SalesInvoice>(salesInvoiceRequest);
                await _salesInvoiceService.AddSalesInvoice(salesInvoice);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = salesInvoiceRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var salesInvoiceDto = _mapper.Map<SalesInvoiceDto>(salesInvoice);
                _logger.LogInformation(LogMessages.SalesInvoiceCreated);
                AddResponseMessage(Response, LogMessages.SalesInvoiceCreated, salesInvoiceDto, true, HttpStatusCode.Created);
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
                var salesInvoices = await _salesInvoiceService.GetAll();
                var salesInvoiceDtos = _mapper.Map<IEnumerable<SalesInvoiceDto>>(salesInvoices);
                AddResponseMessage(Response, LogMessages.SalesInvoicesRetrieved, salesInvoiceDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetSalesInvoicesWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var salesInvoices = await _salesInvoiceService.GetSalesInvoicesWithoutDraftsByCompanyId(companyId);
                if (salesInvoices != null)
                {
                    var salesInvoiceDtos = _mapper.Map<IEnumerable<SalesInvoiceDto>>(salesInvoices);
                    AddResponseMessage(Response, LogMessages.SalesInvoicesRetrieved, salesInvoiceDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesInvoicesNotFound);
                    AddResponseMessage(Response, LogMessages.SalesInvoicesNotFound, null, true, HttpStatusCode.NotFound);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetSalesInvoicesByUserId/{userId}")]
        public async Task<ApiResponseModel> GetSalesInvoicesByUserId(int userId)
        {
            try
            {
                var salesInvoices = await _salesInvoiceService.GetSalesInvoicesByUserId(userId);
                if (salesInvoices != null)
                {
                    var salesInvoiceDtos = _mapper.Map<IEnumerable<SalesInvoiceDto>>(salesInvoices);
                    AddResponseMessage(Response, LogMessages.SalesInvoicesRetrieved, salesInvoiceDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesInvoicesNotFound);
                    AddResponseMessage(Response, LogMessages.SalesInvoicesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{salesInvoiceId}")]
        public async Task<ApiResponseModel> GetSalesInvoiceBySalesInvoiceId(int salesInvoiceId)
        {
            try
            {
                var salesInvoice = await _salesInvoiceService.GetSalesInvoiceBySalesInvoiceId(salesInvoiceId);
                if (salesInvoice != null)
                {
                    var salesInvoiceDto = _mapper.Map<SalesInvoiceDto>(salesInvoice);
                    AddResponseMessage(Response, LogMessages.SalesInvoiceRetrieved, salesInvoiceDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesInvoiceNotFound);
                    AddResponseMessage(Response, LogMessages.SalesInvoiceNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("approve/{salesInvoiceId}")]
        public async Task<ApiResponseModel> ApproveSalesInvoice(int salesInvoiceId, ApproveSalesInvoiceRequestModel approveSalesInvoiceRequest)
        {
            try
            {
                var existingSalesInvoice = await _salesInvoiceService.GetSalesInvoiceBySalesInvoiceId(salesInvoiceId);
                if (existingSalesInvoice == null)
                {
                    _logger.LogWarning(LogMessages.SalesInvoiceNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesInvoiceNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approvedSalesInvoice = _mapper.Map<SalesInvoice>(approveSalesInvoiceRequest);
                approvedSalesInvoice.SalesInvoiceId = salesInvoiceId; // Ensure the ID is not changed

                await _salesInvoiceService.ApproveSalesInvoice(existingSalesInvoice.SalesInvoiceId, approvedSalesInvoice);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = approveSalesInvoiceRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesInvoiceApproved);
                return AddResponseMessage(Response, LogMessages.SalesInvoiceApproved, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPut("{salesInvoiceId}")]
        public async Task<ApiResponseModel> UpdateSalesInvoice(int salesInvoiceId, SalesInvoiceRequestModel salesInvoiceRequest)
        {
            try
            {
                var existingSalesInvoice = await _salesInvoiceService.GetSalesInvoiceBySalesInvoiceId(salesInvoiceId);
                if (existingSalesInvoice == null)
                {
                    _logger.LogWarning(LogMessages.SalesInvoiceNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesInvoiceNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSalesInvoice = _mapper.Map<SalesInvoice>(salesInvoiceRequest);
                updatedSalesInvoice.SalesInvoiceId = salesInvoiceId; // Ensure the ID is not changed
                updatedSalesInvoice.ReferenceNo = existingSalesInvoice.ReferenceNo; // Ensure the ReferenceNo is not changed

                await _salesInvoiceService.UpdateSalesInvoice(existingSalesInvoice.SalesInvoiceId, updatedSalesInvoice);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = salesInvoiceRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesInvoiceUpdated);
                return AddResponseMessage(Response, LogMessages.SalesInvoiceUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
