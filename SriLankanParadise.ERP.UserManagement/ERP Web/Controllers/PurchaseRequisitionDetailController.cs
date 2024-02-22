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
    [Route("api/purchaseRequisitionDetail")]
    public class PurchaseRequisitionDetailController : BaseApiController
    {
        private readonly IPurchaseRequisitionDetailService _purchaseRequisitionDetailService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<PurchaseRequisitionDetailController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PurchaseRequisitionDetailController(
            IPurchaseRequisitionDetailService purchaseRequisitionDetailService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<PurchaseRequisitionDetailController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _purchaseRequisitionDetailService = purchaseRequisitionDetailService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddPurchaseRequisitionDetail(PurchaseRequisitionDetailRequestModel purchaseRequisitionDetailRequest)
        {
            try
            {
                var purchaseRequisitionDetail = _mapper.Map<PurchaseRequisitionDetail>(purchaseRequisitionDetailRequest);
                await _purchaseRequisitionDetailService.AddPurchaseRequisitionDetail(purchaseRequisitionDetail);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = purchaseRequisitionDetailRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var purchaseRequisitionDetailDto = _mapper.Map<PurchaseRequisitionDetailDto>(purchaseRequisitionDetail);
                _logger.LogInformation(LogMessages.PurchaseRequisitionDetailCreated);
                AddResponseMessage(Response, LogMessages.PurchaseRequisitionDetailCreated, purchaseRequisitionDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{purchaseRequisitionDetailId}")]
        public async Task<ApiResponseModel> UpdatePurchaseRequisitionDetail(int purchaseRequisitionDetailId, PurchaseRequisitionDetailRequestModel purchaseRequisitionDetailRequest)
        {
            try
            {
                var existingPurchaseRequisitionDetail = await _purchaseRequisitionDetailService.GetPurchaseRequisitionDetailByPurchaseRequisitionDetailId(purchaseRequisitionDetailId);
                if (existingPurchaseRequisitionDetail == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseRequisitionDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedPurchaseRequisitionDetail = _mapper.Map<PurchaseRequisitionDetail>(purchaseRequisitionDetailRequest);
                updatedPurchaseRequisitionDetail.PurchaseRequisitionDetailId = purchaseRequisitionDetailId; // Ensure the ID is not changed

                await _purchaseRequisitionDetailService.UpdatePurchaseRequisitionDetail(existingPurchaseRequisitionDetail.PurchaseRequisitionDetailId, updatedPurchaseRequisitionDetail);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = purchaseRequisitionDetailRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.PurchaseRequisitionDetailUpdated);
                return AddResponseMessage(Response, LogMessages.PurchaseRequisitionDetailUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{purchaseRequisitionDetailId}")]
        public async Task<ApiResponseModel> DeletePurchaseRequisitionDetail(int purchaseRequisitionDetailId)
        {
            try
            {
                var existingPurchaseRequisitionDetail = await _purchaseRequisitionDetailService.GetPurchaseRequisitionDetailByPurchaseRequisitionDetailId(purchaseRequisitionDetailId);
                if (existingPurchaseRequisitionDetail == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseRequisitionDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _purchaseRequisitionDetailService.DeletePurchaseRequisitionDetail(purchaseRequisitionDetailId);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = 17,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.PurchaseRequisitionDetailDeleted);
                return AddResponseMessage(Response, LogMessages.PurchaseRequisitionDetailDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
