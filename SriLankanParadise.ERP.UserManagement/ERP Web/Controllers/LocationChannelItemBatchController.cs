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
    [Route("api/locationChannelItemBatch")]
    public class LocationChannelItemBatchController : BaseApiController
    {
        private readonly ILocationChannelItemBatchService _locationChannelItemBatchService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationChannelItemBatchController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LocationChannelItemBatchController(
            ILocationChannelItemBatchService locationChannelItemBatchService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationChannelItemBatchController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _locationChannelItemBatchService = locationChannelItemBatchService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddLocationChannelItemBatch(LocationChannelItemBatchRequestModel locationChannelItemBatchRequest)
        {
            try
            {
                var locationChannelItemBatch = _mapper.Map<LocationChannelItemBatch>(locationChannelItemBatchRequest);
                await _locationChannelItemBatchService.AddLocationChannelItemBatch(locationChannelItemBatch);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = locationChannelItemBatchRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var locationChannelItemBatchDto = _mapper.Map<LocationChannelItemBatchDto>(locationChannelItemBatch);
                _logger.LogInformation(LogMessages.LocationChannelItemBatchCreated);
                AddResponseMessage(Response, LogMessages.LocationChannelItemBatchCreated, locationChannelItemBatchDto, true, HttpStatusCode.Created);
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
