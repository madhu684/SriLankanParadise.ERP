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
    [Route("api/issueDetail")]
    public class IssueDetailController : BaseApiController

    {
        private readonly IIssueDetailService _issueDetailService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<IssueDetailController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IssueDetailController(
            IIssueDetailService issueDetailService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<IssueDetailController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _issueDetailService = issueDetailService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddIssueDetail(IssueDetailRequestModel issueDetailRequest)
        {
            try
            {
                var issueDetail = _mapper.Map<IssueDetail>(issueDetailRequest);
                await _issueDetailService.AddIssueDetail(issueDetail);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = issueDetailRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var issueDetailDto = _mapper.Map<IssueDetailDto>(issueDetail);
                _logger.LogInformation(LogMessages.IssueDetailCreated);
                AddResponseMessage(Response, LogMessages.IssueDetailCreated, issueDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("update-received-quantity/{issueMasterId}")]
        public async Task<ApiResponseModel> PatchIssueDetail(int issueMasterId, List<UpdateIssueDetailRequestModel> updateIssueDetailRequestModel)
        {
            try
            {
                var updateIssueDetail = _mapper.Map<List<IssueDetail>>(updateIssueDetailRequestModel);
                var updatedIssueDetail = await _issueDetailService.UpdateIssueDetailReceivedQuantity(issueMasterId, updateIssueDetail);
                var issueDetailDto = _mapper.Map<List<IssueDetailDto>>(updatedIssueDetail);
                AddResponseMessage(Response, LogMessages.RequisitionDetailCreated, issueDetailDto, true, HttpStatusCode.OK);

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
