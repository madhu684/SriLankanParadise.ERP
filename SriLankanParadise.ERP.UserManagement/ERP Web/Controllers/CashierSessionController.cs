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
    [Route("api/cashierSession")]
    public class CashierSessionController : BaseApiController
    {
        private readonly ICashierSessionService _cashierSessionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<CashierSessionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CashierSessionController(
            ICashierSessionService cashierSessionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<CashierSessionController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _cashierSessionService = cashierSessionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCashierSession(CashierSessionRequestModel cashierSessionRequestModel)
        {
            try
            {
                var cashierSession= _mapper.Map<CashierSession>(cashierSessionRequestModel);
                await _cashierSessionService.AddCashierSession(cashierSession);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = cashierSessionRequestModel.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var cashierSessionDto = _mapper.Map<CashierSessionDto>(cashierSession);
                _logger.LogInformation(LogMessages.CashierSessionCreated);
                AddResponseMessage(Response, LogMessages.CashierSessionCreated, cashierSessionDto, true, HttpStatusCode.Created);
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
                var cashierSessions = await _cashierSessionService.GetAll();
                var cashierSessionDtos = _mapper.Map<IEnumerable<CashierSessionDto>>(cashierSessions);
                AddResponseMessage(Response, LogMessages.CashierSessionsRetrieved, cashierSessionDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPut("{cashierSessionId}")]
        public async Task<ApiResponseModel> UpdateCashierSession(int cashierSessionId, CashierSessionRequestModel cashierSessionRequest)
        {
            try
            {
                var existingCashierSession = await _cashierSessionService.GetCashierSessionByCashierSessionId(cashierSessionId);
                if (existingCashierSession == null)
                {
                    _logger.LogWarning(LogMessages.CashierSessionNotFound);
                    return AddResponseMessage(Response, LogMessages.CashierSessionNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedCashierSession = _mapper.Map<CashierSession>(cashierSessionRequest);
                updatedCashierSession.CashierSessionId = cashierSessionId; // Ensure the ID is not changed

                await _cashierSessionService.UpdateCashierSession(existingCashierSession.CashierSessionId, updatedCashierSession);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = cashierSessionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.CashierSessionUpdated);
                return AddResponseMessage(Response, LogMessages.CashierSessionUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetActiveCashierSession/{userId}")]
        public async Task<ApiResponseModel> GetActiveCashierSession(int userId)
        {
            try
            {
                var cashierSession = await _cashierSessionService.GetActiveSessionByUserId(userId);
                if (cashierSession == null)
                {
                    _logger.LogWarning(LogMessages.CashierSessionNotFound);
                    return AddResponseMessage(Response, LogMessages.CashierSessionNotFound, null, true, HttpStatusCode.NotFound);
                }
                var cashierSessionDto = _mapper.Map<CashierSessionDto>(cashierSession);
                AddResponseMessage(Response, LogMessages.CashierSessionRetrieved, cashierSessionDto, true, HttpStatusCode.OK);
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
