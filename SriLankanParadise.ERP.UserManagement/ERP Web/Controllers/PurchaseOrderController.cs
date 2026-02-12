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
    [Route("api/purchaseOrder")]
    public class PurchaseOrderController : BaseApiController
    {
        private readonly IPurchaseOrderService _purchaseOrderService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<PurchaseOrderController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PurchaseOrderController(
            IPurchaseOrderService purchaseOrderService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<PurchaseOrderController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _purchaseOrderService = purchaseOrderService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddPurchaseOrder(PurchaseOrderRequestModel purchaseOrderRequest)
        {
            try
            {
                var purchaseOrder = _mapper.Map<PurchaseOrder>(purchaseOrderRequest);
                await _purchaseOrderService.AddPurchaseOrder(purchaseOrder);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = purchaseOrderRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var purchaseOrderDto = _mapper.Map<PurchaseOrderDto>(purchaseOrder);
                _logger.LogInformation(LogMessages.PurchaseOrderCreated);
                AddResponseMessage(Response, LogMessages.PurchaseOrderCreated, purchaseOrderDto, true, HttpStatusCode.Created);
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
                var purchaseOrders = await _purchaseOrderService.GetAll();
                var purchaseOrderDtos = _mapper.Map<IEnumerable<PurchaseOrderDto>>(purchaseOrders);
                AddResponseMessage(Response, LogMessages.PurchaseOrdersRetrieved, purchaseOrderDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetPurchaseOrdersWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetPurchaseOrdersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var purchaseOrders = await _purchaseOrderService.GetPurchaseOrdersWithoutDraftsByCompanyId(companyId);
                if (purchaseOrders != null)
                {
                    var purchaseOrderDtos = _mapper.Map<IEnumerable<PurchaseOrderDto>>(purchaseOrders);
                    AddResponseMessage(Response, LogMessages.PurchaseOrdersRetrieved, purchaseOrderDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseOrdersNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseOrdersNotFound, null, true, HttpStatusCode.NotFound);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetPurchaseOrdersByUserId/{userId}")]
        public async Task<ApiResponseModel> GetPurchaseOrdersByUserId(int userId)
        {
            try
            {
                var purchaseOrders = await _purchaseOrderService.GetPurchaseOrdersByUserId(userId);
                if (purchaseOrders != null)
                {
                    var purchaseOrderDtos = _mapper.Map<IEnumerable<PurchaseOrderDto>>(purchaseOrders);
                    AddResponseMessage(Response, LogMessages.PurchaseOrdersRetrieved, purchaseOrderDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseOrdersNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseOrdersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{purchaseOrderId}")]
        public async Task<ApiResponseModel> GetPurchaseOrderByPurchaseOrderId(int purchaseOrderId)
        {
            try
            {
                var purchaseOrder = await _purchaseOrderService.GetPurchaseOrderByPurchaseOrderId(purchaseOrderId);
                if (purchaseOrder != null)
                {
                    var purchaseOrderDto = _mapper.Map<PurchaseOrderDto>(purchaseOrder);
                    AddResponseMessage(Response, LogMessages.PurchaseOrderRetrieved, purchaseOrderDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseOrderNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseOrderNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("approve/{purchaseOrderId}")]
        public async Task<ApiResponseModel> ApprovePurchaseOrder(int purchaseOrderId, ApprovePurchaseOrderRequestModel approvePurchaseOrderRequest)
        {
            try
            {
                var existingPurchaseOrder = await _purchaseOrderService.GetPurchaseOrderByPurchaseOrderId(purchaseOrderId);
                if (existingPurchaseOrder == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseOrderNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseOrderNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approvedPurchaseOrder = _mapper.Map<PurchaseOrder>(approvePurchaseOrderRequest);
                approvedPurchaseOrder.PurchaseOrderId = purchaseOrderId; // Ensure the ID is not changed

                await _purchaseOrderService.ApprovePurchaseOrder(existingPurchaseOrder.PurchaseOrderId, approvedPurchaseOrder);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = approvePurchaseOrderRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.PurchaseOrderApproved);
                return AddResponseMessage(Response, LogMessages.PurchaseOrderApproved, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPut("{purchaseOrderId}")]
        public async Task<ApiResponseModel> UpdatePurchaseOrder(int purchaseOrderId, PurchaseOrderRequestModel purchaseOrderRequest)
        {
            try
            {
                var existingPurchaseOrder = await _purchaseOrderService.GetPurchaseOrderByPurchaseOrderId(purchaseOrderId);
                if (existingPurchaseOrder == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseOrderNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseOrderNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedPurchaseOrder = _mapper.Map<PurchaseOrder>(purchaseOrderRequest);
                updatedPurchaseOrder.PurchaseOrderId = purchaseOrderId; // Ensure the ID is not changed
                updatedPurchaseOrder.ReferenceNo = existingPurchaseOrder.ReferenceNo; // // Ensure the ReferenceNo is not changed

                await _purchaseOrderService.UpdatePurchaseOrder(existingPurchaseOrder.PurchaseOrderId, updatedPurchaseOrder);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = purchaseOrderRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.PurchaseOrderUpdated);
                return AddResponseMessage(Response, LogMessages.PurchaseOrderUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetPurchaseOrdersByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetPurchaseOrdersByCompanyId(int companyId)
        {
            try
            {
                var purchaseOrders = await _purchaseOrderService.GetPurchaseOrdersByCompanyId(companyId);
                if (purchaseOrders != null)
                {
                    var purchaseOrderDtos = _mapper.Map<IEnumerable<PurchaseOrderDto>>(purchaseOrders);
                    AddResponseMessage(Response, LogMessages.PurchaseOrdersRetrieved, purchaseOrderDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseOrdersNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseOrdersNotFound, null, true, HttpStatusCode.NotFound);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpDelete("{purchaseOrderId}")]
        public async Task<ApiResponseModel> DeletePurchaseOrder(int purchaseOrderId)
        {
            try
            {
                var existingPurchaseOrder = await _purchaseOrderService.GetPurchaseOrderByPurchaseOrderId(purchaseOrderId);
                if (existingPurchaseOrder == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseOrderNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseOrderNotFound, null, true, HttpStatusCode.NotFound);
                }
                await _purchaseOrderService.DeletePurchaseOrder(purchaseOrderId);
                _logger.LogInformation(LogMessages.PurchaseOrderDeleted);
                return AddResponseMessage(Response, LogMessages.PurchaseOrderDeleted, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetPaginatedPurchaseOrdersByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetPaginatedPurchaseOrdersByCompanyId(
            int companyId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _purchaseOrderService.GetPaginatedPurchaseOrdersByCompanyId(companyId, pageNumber, pageSize);

                if (result.Items.Any())
                {
                    var purchaseOrderDtos = _mapper.Map<IEnumerable<PurchaseOrderDto>>(result.Items);

                    var responseData = new
                    {
                        Data = purchaseOrderDtos,
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

                    AddResponseMessage(Response, LogMessages.PurchaseOrdersRetrieved, responseData, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseOrdersNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseOrdersNotFound, null, true, HttpStatusCode.OK);
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
