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
    [Route("api/cashierExpenseOut")]
    public class CashierExpenseOutController : BaseApiController
    {
        private readonly ICashierExpenseOutService _cashierExpenseOutService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<CashierExpenseOutController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CashierExpenseOutController(
            ICashierExpenseOutService cashierExpenseOutService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<CashierExpenseOutController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _cashierExpenseOutService = cashierExpenseOutService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCashierExpenseOut(CashierExpenseOutRequestModel cashierExpenseOutRequest)
        {
            try
            {
                var cashierExpenseOut = _mapper.Map<CashierExpenseOut>(cashierExpenseOutRequest);
                await _cashierExpenseOutService.AddCashierExpenseOut(cashierExpenseOut);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = cashierExpenseOutRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var CashierExpenseOutDto = _mapper.Map<CashierExpenseOutDto>(cashierExpenseOut);
                _logger.LogInformation(LogMessages.CashierExpenseOutCreated);
                AddResponseMessage(Response, LogMessages.CashierExpenseOutCreated, CashierExpenseOutDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetCashierExpenseOutsByUserId/{userId}")]
        public async Task<ApiResponseModel> GetCashierExpenseOutsByUserId(int userId)
        {
            try
            {
                var cashierExpenseOuts = await _cashierExpenseOutService.GetCashierExpenseOutsByUserId(userId);
                if (cashierExpenseOuts != null)
                {
                    var cashierExpenseOutsDtos = _mapper.Map<IEnumerable<CashierExpenseOutDto>>(cashierExpenseOuts);
                    AddResponseMessage(Response, LogMessages.CashierExpenseOutsRetrieved, cashierExpenseOutsDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.CashierExpenseOutsNotFound);
                    AddResponseMessage(Response, LogMessages.CashierExpenseOutsNotFound, null, true, HttpStatusCode.NotFound);
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
