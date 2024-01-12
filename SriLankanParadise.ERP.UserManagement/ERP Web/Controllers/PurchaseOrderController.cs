using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
                var actionLog = new ActionLogModel()
                {
                    ActionId = purchaseOrderRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

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
    }
}
