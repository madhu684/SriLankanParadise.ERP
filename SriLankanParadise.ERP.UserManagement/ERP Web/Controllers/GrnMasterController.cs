using AutoMapper;
using System.Net;
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
    [Route("api/grnMaster")]
    public class GrnMasterController : BaseApiController
    {
        private readonly IGrnMasterService _grnMasterService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<GrnMasterController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GrnMasterController(
            IGrnMasterService grnMasterService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<GrnMasterController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _grnMasterService = grnMasterService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddGrnMaster(GrnMasterRequestModel grnMasterRequest)
        {
            try
            {
                var grnMaster = _mapper.Map<GrnMaster>(grnMasterRequest);
                await _grnMasterService.AddGrnMaster(grnMaster);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = grnMasterRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var grnMasterDto = _mapper.Map<GrnMasterDto>(grnMaster);
                _logger.LogInformation(LogMessages.GrnMasterCreated);
                AddResponseMessage(Response, LogMessages.GrnMasterCreated, grnMasterDto, true, HttpStatusCode.Created);
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
                var grnMasters = await _grnMasterService.GetAll();
                var grnMasterDtos = _mapper.Map<IEnumerable<GrnMasterDto>>(grnMasters);
                AddResponseMessage(Response, LogMessages.GrnMastersRetrieved, grnMasterDtos, true, HttpStatusCode.OK);
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
