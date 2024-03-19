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
    [Route("api/chargesAndDeduction")]
    public class ChargesAndDeductionController : BaseApiController
    {
        private readonly IChargesAndDeductionService _chargesAndDeductionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ChargesAndDeductionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChargesAndDeductionController(
            IChargesAndDeductionService chargesAndDeductionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ChargesAndDeductionController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _chargesAndDeductionService = chargesAndDeductionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddChargesAndDeduction(ChargesAndDeductionRequestModel chargesAndDeductionRequest)
        {
            try
            {
                var chargesAndDeduction = _mapper.Map<ChargesAndDeduction>(chargesAndDeductionRequest);
                await _chargesAndDeductionService.AddChargesAndDeduction(chargesAndDeduction);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = chargesAndDeductionRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var chargesAndDeductionDto = _mapper.Map<ChargesAndDeductionDto>(chargesAndDeduction);
                _logger.LogInformation(LogMessages.ChargesAndDeductionCreated);
                AddResponseMessage(Response, LogMessages.ChargesAndDeductionCreated, chargesAndDeductionDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetChargesAndDeductionsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetChargesAndDeductionsByCompanyId(int companyId)
        {
            try
            {
                var chargesAndDeductions = await _chargesAndDeductionService.GetChargesAndDeductionsByCompanyId(companyId);
                if (chargesAndDeductions != null)
                {
                    var chargesAndDeductionDtos = _mapper.Map<IEnumerable<ChargesAndDeductionDto>>(chargesAndDeductions);
                    AddResponseMessage(Response, LogMessages.ChargesAndDeductionsRetrieved, chargesAndDeductionDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ChargesAndDeductionsNotFound);
                    AddResponseMessage(Response, LogMessages.ChargesAndDeductionsNotFound, null, true, HttpStatusCode.NotFound);
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
