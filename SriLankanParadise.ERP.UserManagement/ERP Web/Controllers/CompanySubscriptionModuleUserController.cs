using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/companySubscriptionModuleUser")]
    public class CompanySubscriptionModuleUserController : BaseApiController
    {
        private readonly ICompanySubscriptionModuleUserService _companySubscriptionModuleUserService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<CompanySubscriptionModuleUserController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CompanySubscriptionModuleUserController(
            ICompanySubscriptionModuleUserService companySubscriptionModuleUserService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<CompanySubscriptionModuleUserController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _companySubscriptionModuleUserService = companySubscriptionModuleUserService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCompanySubscriptionModuleUser(CompanySubscriptionModuleUserRequestModel companySubscriptionModuleUserRequest)
        {
            try
            {
                var companySubscriptionModuleUser = _mapper.Map<CompanySubscriptionModuleUser>(companySubscriptionModuleUserRequest);
                await _companySubscriptionModuleUserService.AddCompanySubscriptionModuleUser(companySubscriptionModuleUser);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = companySubscriptionModuleUserRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.CompanySubscriptionModuleUserCreated);
                AddResponseMessage(Response, LogMessages.CompanySubscriptionModuleUserCreated, null, true, HttpStatusCode.Created);
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
