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
    [Route("api/batchHasGrnMaster")]
    public class BatchHasGrnMasterController : BaseApiController
    {
        private readonly IBatchHasGrnMasterService _batchHasGrnMasterService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<BatchHasGrnMasterController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BatchHasGrnMasterController(
            IBatchHasGrnMasterService batchHasGrnMasterService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<BatchHasGrnMasterController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _batchHasGrnMasterService = batchHasGrnMasterService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddBatchHasGrnMaster(BatchHasGrnMasterRequestModel batchHasGrnMasterRequest)
        {
            try
            {
                var batchHasGrnMaster = _mapper.Map<BatchHasGrnMaster>(batchHasGrnMasterRequest);
                await _batchHasGrnMasterService.AddBatchHasGrnMaster(batchHasGrnMaster);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = batchHasGrnMasterRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var batchHasGrnMasterDto = _mapper.Map<BatchHasGrnMasterDto>(batchHasGrnMaster);
                _logger.LogInformation(LogMessages.BatchHasGrnMasterCreated);
                AddResponseMessage(Response, LogMessages.BatchHasGrnMasterCreated, batchHasGrnMasterDto, true, HttpStatusCode.Created);
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
