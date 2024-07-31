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
    [Route("api/businessType")]
    public class BusinessTypeController : BaseApiController
    {
        private readonly IBusinessTypeService _businessTypeService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<BusinessTypeController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BusinessTypeController(
            IBusinessTypeService businessTypeService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<BusinessTypeController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _businessTypeService = businessTypeService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddBusinessType(BusinessTypeRequestModel businessTypeRequest)
        {
            try
            {
                var businessType = _mapper.Map<BusinessType>(businessTypeRequest);
                await _businessTypeService.AddBusinessType(businessType);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = businessTypeRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var businessTypeDto = _mapper.Map<BusinessTypeDto>(businessType);
                _logger.LogInformation(LogMessages.BusinessTypeCreated);
                AddResponseMessage(Response, LogMessages.BusinessTypeCreated, businessTypeDto, true, HttpStatusCode.Created);
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
                var businessTypes = await _businessTypeService.GetAll();
                var businessTypeDtos = _mapper.Map<IEnumerable<BusinessTypeDto>>(businessTypes);
                AddResponseMessage(Response, LogMessages.BusinessTypesRetrieved, businessTypeDtos, true, HttpStatusCode.OK);
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
