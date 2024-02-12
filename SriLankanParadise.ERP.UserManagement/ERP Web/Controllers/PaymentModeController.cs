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
    [Route("api/paymentMode")]
    public class PaymentModeController : BaseApiController

    {
        private readonly IPaymentModeService _paymentModeService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<PaymentModeController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PaymentModeController(
            IPaymentModeService paymentModeService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<PaymentModeController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _paymentModeService = paymentModeService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddPaymentMode(PaymentModeRequestModel paymentModeRequest)
        {
            try
            {
                var paymentMode = _mapper.Map<PaymentMode>(paymentModeRequest);
                await _paymentModeService.AddPaymentMode(paymentMode);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = paymentModeRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var paymentModeDto = _mapper.Map<PaymentModeDto>(paymentMode);
                _logger.LogInformation(LogMessages.PaymentModeCreated);
                AddResponseMessage(Response, LogMessages.PaymentModeCreated, paymentModeDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetPaymentModesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetPaymentModesByCompanyId(int companyId)
        {
            try
            {
                var paymentModes = await _paymentModeService.GetPaymentModesByCompanyId(companyId);
                if (paymentModes != null)
                {
                    var paymentModeDtos = _mapper.Map<IEnumerable<PaymentModeDto>>(paymentModes);
                    AddResponseMessage(Response, LogMessages.PaymentModesRetrieved, paymentModeDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PaymentModesNotFound);
                    AddResponseMessage(Response, LogMessages.PaymentModesNotFound, null, true, HttpStatusCode.NotFound);
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
