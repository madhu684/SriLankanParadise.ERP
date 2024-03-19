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
    [Route("api/chargesAndDeductionApplied")]
    public class ChargesAndDeductionAppliedController : BaseApiController
    {
        private readonly IChargesAndDeductionAppliedService _chargesAndDeductionAppliedService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ChargesAndDeductionAppliedController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChargesAndDeductionAppliedController(
            IChargesAndDeductionAppliedService chargesAndDeductionAppliedService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ChargesAndDeductionAppliedController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _chargesAndDeductionAppliedService = chargesAndDeductionAppliedService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddChargesAndDeductionApplied(ChargesAndDeductionAppliedRequestModel chargesAndDeductionAppliedRequest)
        {
            try
            {
                var chargesAndDeductionApplied = _mapper.Map<ChargesAndDeductionApplied>(chargesAndDeductionAppliedRequest);
                await _chargesAndDeductionAppliedService.AddChargesAndDeductionApplied(chargesAndDeductionApplied);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = chargesAndDeductionAppliedRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var chargesAndDeductionAppliedDto = _mapper.Map<ChargesAndDeductionAppliedDto>(chargesAndDeductionApplied);
                _logger.LogInformation(LogMessages.ChargesAndDeductionAppliedCreated);
                AddResponseMessage(Response, LogMessages.ChargesAndDeductionAppliedCreated, chargesAndDeductionAppliedDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetChargesAndDeductionsApplied")]
        public async Task<ApiResponseModel> GetChargesAndDeductionsApplied(int transactionTypeId, int transactionId, int companyId)
        {
            try
            {
                var chargesAndDeductionsApplied = await _chargesAndDeductionAppliedService.GetChargesAndDeductionsApplied(transactionTypeId, transactionId, companyId);
                if (chargesAndDeductionsApplied != null)
                {
                    var chargesAndDeductionAppliedDtos= _mapper.Map<IEnumerable<ChargesAndDeductionAppliedDto>>(chargesAndDeductionsApplied);
                    AddResponseMessage(Response, LogMessages.ChargesAndDeductionsAppliedRetrieved, chargesAndDeductionAppliedDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ChargesAndDeductionsAppliedNotFound);
                    AddResponseMessage(Response, LogMessages.ChargesAndDeductionsAppliedNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{chargesAndDeductionAppliedId}")]
        public async Task<ApiResponseModel> UpdateChargesAndDeductionApplied(int chargesAndDeductionAppliedId, ChargesAndDeductionAppliedRequestModel chargesAndDeductionAppliedRequest)
        {
            try
            {
                var existingChargesAndDeductionApplied = await _chargesAndDeductionAppliedService.GetChargesAndDeductionAppliedByChargesAndDeductionAppliedId(chargesAndDeductionAppliedId);
                if (existingChargesAndDeductionApplied == null)
                {
                    _logger.LogWarning(LogMessages.ChargesAndDeductionAppliedNotFound);
                    return AddResponseMessage(Response, LogMessages.ChargesAndDeductionAppliedNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedChargesAndDeductionApplied = _mapper.Map<ChargesAndDeductionApplied>(chargesAndDeductionAppliedRequest);
                updatedChargesAndDeductionApplied.ChargesAndDeductionAppliedId = chargesAndDeductionAppliedId; // Ensure the ID is not changed

                await _chargesAndDeductionAppliedService.UpdateChargesAndDeductionApplied(existingChargesAndDeductionApplied.ChargesAndDeductionAppliedId, updatedChargesAndDeductionApplied);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = chargesAndDeductionAppliedRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ChargesAndDeductionAppliedUpdated);
                return AddResponseMessage(Response, LogMessages.ChargesAndDeductionAppliedUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{chargesAndDeductionAppliedId}")]
        public async Task<ApiResponseModel> DeleteChargesAndDeductionApplied(int chargesAndDeductionAppliedId)
        {
            try
            {
                var existingChargesAndDeductionApplied = await _chargesAndDeductionAppliedService.GetChargesAndDeductionAppliedByChargesAndDeductionAppliedId(chargesAndDeductionAppliedId);
                if (existingChargesAndDeductionApplied == null)
                {
                    _logger.LogWarning(LogMessages.ChargesAndDeductionAppliedNotFound);
                    return AddResponseMessage(Response, LogMessages.ChargesAndDeductionAppliedNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _chargesAndDeductionAppliedService.DeleteChargesAndDeductionApplied(chargesAndDeductionAppliedId);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = 1058,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ChargesAndDeductionAppliedDeleted);
                return AddResponseMessage(Response, LogMessages.ChargesAndDeductionAppliedDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
