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
    [Route("api/requisitionDetail")]
    public class RequisitionDetailController : BaseApiController
    {
        private readonly IRequisitionDetailService _requisitionDetailService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<RequisitionDetailController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RequisitionDetailController(
            IRequisitionDetailService requisitionDetailService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<RequisitionDetailController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _requisitionDetailService = requisitionDetailService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddRequisitionDetail(RequisitionDetailRequestModel requisitionDetailRequest)
        {
            try
            {
                var requisitionDetail = _mapper.Map<RequisitionDetail>(requisitionDetailRequest);
                await _requisitionDetailService.AddRequisitionDetail(requisitionDetail);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = requisitionDetailRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var requisitionDetailDto= _mapper.Map<RequisitionDetailDto>(requisitionDetail);
                _logger.LogInformation(LogMessages.RequisitionDetailCreated);
                AddResponseMessage(Response, LogMessages.RequisitionDetailCreated, requisitionDetailDto, true, HttpStatusCode.Created);
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
