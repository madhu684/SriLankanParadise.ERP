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
    [Route("api/itemBatchHasGrnDetail")]
    public class ItemBatchHasGrnDetailController : BaseApiController
    {
        private readonly IItemBatchHasGrnDetailService _itemBatchHasGrnDetailService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ItemBatchHasGrnDetailController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ItemBatchHasGrnDetailController(
            IItemBatchHasGrnDetailService itemBatchHasGrnDetailService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ItemBatchHasGrnDetailController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _itemBatchHasGrnDetailService = itemBatchHasGrnDetailService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddItemBatchHasGrnDetail(ItemBatchHasGrnDetailRequestModel itemBatchHasGrnDetailRequest)
        {
            try
            {
                var itemBatchHasGrnDetail= _mapper.Map<ItemBatchHasGrnDetail>(itemBatchHasGrnDetailRequest);
                await _itemBatchHasGrnDetailService.AddItemBatchHasGrnDetail(itemBatchHasGrnDetail);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = itemBatchHasGrnDetailRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var itemBatchHasGrnDetailDto = _mapper.Map<ItemBatchHasGrnDetailDto>(itemBatchHasGrnDetail);
                _logger.LogInformation(LogMessages.ItemBatchHasGrnDetailCreated);
                AddResponseMessage(Response, LogMessages.ItemBatchHasGrnDetailCreated, itemBatchHasGrnDetailDto, true, HttpStatusCode.Created);
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
