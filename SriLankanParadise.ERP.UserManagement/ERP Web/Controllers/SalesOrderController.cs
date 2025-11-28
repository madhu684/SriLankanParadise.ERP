using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/salesOrder")]
    public class SalesOrderController : BaseApiController
    {
        private readonly ISalesOrderService _salesOrderService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SalesOrderController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly INotificationService _notificationService;

        public SalesOrderController(
            ISalesOrderService salesOrderService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SalesOrderController> logger,
            IHttpContextAccessor httpContextAccessor,
            INotificationService notificationService)
        {
            _salesOrderService = salesOrderService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _notificationService = notificationService;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSalesOrder(SalesOrderRequestModel salesOrderRequest)
        {
            try
            {
                var salesOrder = _mapper.Map<SalesOrder>(salesOrderRequest);
                await _salesOrderService.AddSalesOrder(salesOrder);

                var salesOrderDto = _mapper.Map<SalesOrderDto>(salesOrder);

                // Send notification to all logged-in users
                await _notificationService.SendNotificationToAllLoggedUsers(new NotificationDto
                {
                    Title = "New Sales Order Created",
                    Type = "SalesOrder",
                    Action = "Created",
                    Data = new
                    {
                        salesOrderId = salesOrderDto.SalesOrderId,
                        reference = salesOrderDto.ReferenceNo,
                        amount = salesOrderDto.TotalAmount,
                    }
                });

                _logger.LogInformation(LogMessages.SalesOrderCreated);
                AddResponseMessage(Response, LogMessages.SalesOrderCreated, salesOrderDto, true, HttpStatusCode.Created);
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
                var salesOrders = await _salesOrderService.GetAll();
                var salesOrderDtos = _mapper.Map<IEnumerable<SalesOrderDto>>(salesOrders);
                AddResponseMessage(Response, LogMessages.SalesOrdersRetrieved, salesOrderDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetSalesOrdersWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetSalesOrdersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var salesOrders = await _salesOrderService.GetSalesOrdersWithoutDraftsByCompanyId(companyId);
                if (salesOrders != null)
                {
                    var salesOrderDtos = _mapper.Map<IEnumerable<SalesOrderDto>>(salesOrders);
                    AddResponseMessage(Response, LogMessages.SalesOrdersRetrieved, salesOrderDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesOrdersNotFound);
                    AddResponseMessage(Response, LogMessages.SalesOrdersNotFound, null, true, HttpStatusCode.NotFound);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetSalesOrdersByUserId/{userId}")]
        public async Task<ApiResponseModel> GetSalesOrdersByUserId(int userId)
        {
            try
            {
                var salesOrders = await _salesOrderService.GetSalesOrdersByUserId(userId);
                if (salesOrders != null)
                {
                    var salesOrderDtos = _mapper.Map<IEnumerable<SalesOrderDto>>(salesOrders);
                    AddResponseMessage(Response, LogMessages.SalesOrdersRetrieved, salesOrderDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesOrdersNotFound);
                    AddResponseMessage(Response, LogMessages.SalesOrdersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{salesOrderId}")]
        public async Task<ApiResponseModel> GetSalesOrderBySalesOrderId(int salesOrderId)
        {
            try
            {
                var salesOrder = await _salesOrderService.GetSalesOrderBySalesOrderId(salesOrderId);
                if (salesOrder != null)
                {
                    var salesOrderDto = _mapper.Map<SalesOrderDto>(salesOrder);
                    AddResponseMessage(Response, LogMessages.SalesOrderRetrieved, salesOrderDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesOrderNotFound);
                    AddResponseMessage(Response, LogMessages.SalesOrderNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("approve/{salesOrderId}")]
        public async Task<ApiResponseModel> ApproveSalesOrder(int salesOrderId, ApproveSalesOrderRequestModel approveSalesOrderRequest)
        {
            try
            {
                var existingSalesOrder = await _salesOrderService.GetSalesOrderBySalesOrderId(salesOrderId);
                if (existingSalesOrder == null)
                {
                    _logger.LogWarning(LogMessages.SalesOrderNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesOrderNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approvedSalesOrder = _mapper.Map<SalesOrder>(approveSalesOrderRequest);
                approvedSalesOrder.SalesOrderId = salesOrderId; // Ensure the ID is not changed

                await _salesOrderService.ApproveSalesOrder(existingSalesOrder.SalesOrderId, approvedSalesOrder);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = approveSalesOrderRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesOrderApproved);
                return AddResponseMessage(Response, LogMessages.SalesOrderApproved, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPut("{salesOrderId}")]
        public async Task<ApiResponseModel> UpdateSalesOrder(int salesOrderId, SalesOrderRequestModel salesOrderRequest)
        {
            try
            {
                var existingSalesOrder = await _salesOrderService.GetSalesOrderBySalesOrderId(salesOrderId);
                if (existingSalesOrder == null)
                {
                    _logger.LogWarning(LogMessages.SalesOrderNotFound);
                    return AddResponseMessage(Response, LogMessages.SalesOrderNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSalesOrder = _mapper.Map<SalesOrder>(salesOrderRequest);
                updatedSalesOrder.SalesOrderId = salesOrderId; // Ensure the ID is not changed
                updatedSalesOrder.ReferenceNo = existingSalesOrder.ReferenceNo; // // Ensure the ReferenceNo is not changed

                await _salesOrderService.UpdateSalesOrder(existingSalesOrder.SalesOrderId, updatedSalesOrder);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = salesOrderRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SalesOrderUpdated);
                return AddResponseMessage(Response, LogMessages.SalesOrderUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("SalesOrderDetailsByOrderDateRange")]
        public async Task<ApiResponseModel> GetSalesOrderDetailsByOrderDateRange([FromQuery]DateTime fromDate, [FromQuery] DateTime toDate)
        {
            try
            {
                var salesOrderDetails = await _salesOrderService.GetSalesOrderDetailsByOrderDateRange(fromDate, toDate);
                var salesOrderDto = _mapper.Map<IEnumerable<SalesOrderDto>>(salesOrderDetails);
                AddResponseMessage(Response, LogMessages.SalesOrderRetrieved, salesOrderDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("SalesOrderCountPerDateRange")]
        public async Task<ApiResponseModel> GetSalesOrderCountPerDate([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            try
            {
                var salesOrderCount = await _salesOrderService.GetSalesOrderCountPerDateRange(fromDate, toDate);
                AddResponseMessage(Response, LogMessages.SalesOrderRetrieved, salesOrderCount, true, HttpStatusCode.OK);
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
