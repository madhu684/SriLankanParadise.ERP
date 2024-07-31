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
    [Route("api/companyType")]
    public class CompanyTypeController : BaseApiController
    {
        private readonly ICompanyTypeService _companyTypeService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<CompanyTypeController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CompanyTypeController(
            ICompanyTypeService companyTypeService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<CompanyTypeController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _companyTypeService = companyTypeService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCompanyType(CompanyTypeRequestModel companyTypeRequest)
        {
            try
            {
                var companyType = _mapper.Map<CompanyType>(companyTypeRequest);
                await _companyTypeService.AddCompanyType(companyType);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = companyTypeRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var companyTypeDto = _mapper.Map<CompanyTypeDto>(companyType);
                _logger.LogInformation(LogMessages.BusinessTypeCreated);
                AddResponseMessage(Response, LogMessages.CompanyTypeCreated, companyTypeDto, true, HttpStatusCode.Created);
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
                var companyTypes = await _companyTypeService.GetAll();
                var companyTypeDtos = _mapper.Map<IEnumerable<CompanyTypeDto>>(companyTypes);
                AddResponseMessage(Response, LogMessages.CompanyTypesRetrieved, companyTypeDtos, true, HttpStatusCode.OK);
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
