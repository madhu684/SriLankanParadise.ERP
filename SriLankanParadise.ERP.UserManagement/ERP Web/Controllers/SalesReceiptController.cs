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
    [Route("api/salesReceipt")]
    public class SalesReceiptController : BaseApiController
    {
        private readonly ISalesReceiptService _salesReceiptService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SalesReceiptController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SalesReceiptController(
            ISalesReceiptService salesReceiptService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SalesReceiptController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _salesReceiptService = salesReceiptService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSalesReceipt(SalesReceiptRequestModel salesReceiptRequestModel)
        {
            try
            {
                var salesReceipt = _mapper.Map<SalesReceipt>(salesReceiptRequestModel);
                await _salesReceiptService.AddSalesReceipt(salesReceipt);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = salesReceiptRequestModel.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var salesReceiptDto = _mapper.Map<SalesReceiptDto>(salesReceipt);
                _logger.LogInformation(LogMessages.SalesReceiptCreated);
                AddResponseMessage(Response, LogMessages.SalesReceiptCreated, salesReceiptDto, true, HttpStatusCode.Created);
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
                var salesReceipts = await _salesReceiptService.GetAll();
                var salesReceiptDtos = _mapper.Map<IEnumerable<SalesReceiptDto>>(salesReceipts);
                AddResponseMessage(Response, LogMessages.SalesReceiptsRetrieved, salesReceiptDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetSalesReceiptsWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetSalesReceiptsByCompanyId(
            int companyId, 
            [FromQuery] DateTime? date = null,
            [FromQuery] int? createdUserId = null,
            [FromQuery] string? filter = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _salesReceiptService.GetSalesReceiptsWithoutDraftsByCompanyId(companyId, date, createdUserId, filter, pageNumber, pageSize);

                if (result.Items.Any())
                {
                    var salesReceiptDtos = _mapper.Map<IEnumerable<SalesReceiptDto>>(result.Items);

                    var responseData = new
                    {
                        Data = salesReceiptDtos,
                        Pagination = new
                        {
                            result.TotalCount,
                            result.PageNumber,
                            result.PageSize,
                            result.TotalPages,
                            result.HasPreviousPage,
                            result.HasNextPage
                        }
                    };

                    AddResponseMessage(Response, LogMessages.SalesReceiptsRetrieved, responseData, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesReceiptsNotFound);
                    AddResponseMessage(Response, LogMessages.SalesReceiptsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetSalesReceiptsByUserId/{userId}")]
        public async Task<ApiResponseModel> GetSalesReceiptsByUserId(int userId)
        {
            try
            {
                var salesReceipts = await _salesReceiptService.GetSalesReceiptsByUserId(userId);
                if (salesReceipts != null)
                {
                    var salesReceiptDtos = _mapper.Map<IEnumerable<SalesReceiptDto>>(salesReceipts);
                    AddResponseMessage(Response, LogMessages.SalesReceiptsRetrieved, salesReceiptDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesReceiptsNotFound);
                    AddResponseMessage(Response, LogMessages.SalesReceiptsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{salesReceiptId}")]
        public async Task<ApiResponseModel> GetSalesReceiptBySalesReceiptId(int salesReceiptId)
        {
            try
            {
                var salesReceipt = await _salesReceiptService.GetSalesReceiptBySalesReceiptId(salesReceiptId);
                if (salesReceipt != null)
                {
                    var salesReceiptDto = _mapper.Map<SalesReceiptDto>(salesReceipt);
                    AddResponseMessage(Response, LogMessages.SalesReceiptRetrieved, salesReceiptDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesReceiptNotFound);
                    AddResponseMessage(Response, LogMessages.SalesReceiptNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{salesReceiptId}")]
        public async Task<ApiResponseModel> UpdateSalesReceipt(int salesReceiptId, SalesReceiptRequestModel salesReceiptRequest)
        {
            try
            {
                var existingSalesReceipt = await _salesReceiptService.GetSalesReceiptBySalesReceiptId(salesReceiptId);
                if (existingSalesReceipt == null)
                {
                    _logger.LogWarning(LogMessages.SalesReceiptNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesReceiptNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSalesReceipt = _mapper.Map<SalesReceipt>(salesReceiptRequest);
                updatedSalesReceipt.SalesReceiptId = salesReceiptId; // Ensure the ID is not changed
                
                await _salesReceiptService.UpdateSalesReceipt(existingSalesReceipt.SalesReceiptId, updatedSalesReceipt);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = salesReceiptRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesReceiptUpdated);
                return AddResponseMessage(Response, LogMessages.SalesReceiptUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetSalesReceiptsBySessionId/{sessionId}")]
        public async Task<ApiResponseModel> GetSalesReceiptsBySessionId(int sessionId)
        {
            try
            {
                var salesReceipts = await _salesReceiptService.GetSalesReceiptsBySessionId(sessionId);
                if (salesReceipts != null)
                {
                    var salesReceiptDtos = _mapper.Map<IEnumerable<SalesReceiptDto>>(salesReceipts);
                    AddResponseMessage(Response, LogMessages.SalesReceiptsRetrieved, salesReceiptDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesReceiptsNotFound);
                    AddResponseMessage(Response, LogMessages.SalesReceiptsNotFound, null, true, HttpStatusCode.NotFound);
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
