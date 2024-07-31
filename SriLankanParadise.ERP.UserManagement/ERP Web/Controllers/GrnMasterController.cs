using AutoMapper;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using SriLankanParadise.ERP.UserManagement.Business_Service;

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
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = grnMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

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

        [HttpGet("GetGrnMastersWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetGrnMastersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var grnMasters = await _grnMasterService.GetGrnMastersWithoutDraftsByCompanyId(companyId);
                if (grnMasters != null)
                {
                    var grnMasterDtos = _mapper.Map<IEnumerable<GrnMasterDto>>(grnMasters);
                    AddResponseMessage(Response, LogMessages.GrnMastersRetrieved, grnMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.GrnMastersNotFound);
                    AddResponseMessage(Response, LogMessages.GrnMastersNotFound, null, true, HttpStatusCode.NotFound);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetGrnMastersByUserId/{userId}")]
        public async Task<ApiResponseModel> GetGrnMastersByUserId(int userId)
        {
            try
            {
                var grnMasters = await _grnMasterService.GetGrnMastersByUserId(userId);
                if (grnMasters != null)
                {
                    var grnMasterDtos = _mapper.Map<IEnumerable<GrnMasterDto>>(grnMasters);
                    AddResponseMessage(Response, LogMessages.GrnMastersRetrieved, grnMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.GrnMastersNotFound);
                    AddResponseMessage(Response, LogMessages.GrnMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{grnMasterId}")]
        public async Task<ApiResponseModel> GetGrnMasterByGrnMasterId(int grnMasterId)
        {
            try
            {
                var grnMaster = await _grnMasterService.GetGrnMasterByGrnMasterId(grnMasterId);
                if (grnMaster != null)
                {
                    var grnMasterDto = _mapper.Map<GrnMasterDto>(grnMaster);
                    AddResponseMessage(Response, LogMessages.GrnMasterRetrieved, grnMasterDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.GrnMasterNotFound);
                    AddResponseMessage(Response, LogMessages.GrnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("approve/{grnMasterId}")]
        public async Task<ApiResponseModel> ApproveGrnMaster(int grnMasterId, ApproveGrnMasterRequestModel approveGrnMasterRequest)
        {
            try
            {
                var existingGrnMaster = await _grnMasterService.GetGrnMasterByGrnMasterId(grnMasterId);
                if (existingGrnMaster == null)
                {
                    _logger.LogWarning(LogMessages.GrnMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.GrnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approvedGrnMaster = _mapper.Map<GrnMaster>(approveGrnMasterRequest);
                approvedGrnMaster.GrnMasterId = grnMasterId; // Ensure the ID is not changed

                await _grnMasterService.ApproveGrnMaster(existingGrnMaster.GrnMasterId, approvedGrnMaster);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = approveGrnMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.GrnMasterApproved);
                return AddResponseMessage(Response, LogMessages.GrnMasterApproved, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPut("{grnMasterId}")]
        public async Task<ApiResponseModel> UpdateGrnMaster(int grnMasterId, GrnMasterRequestModel grnMasterRequest)
        {
            try
            {
                var existingGrnMaster = await _grnMasterService.GetGrnMasterByGrnMasterId(grnMasterId);
                if (existingGrnMaster == null)
                {
                    _logger.LogWarning(LogMessages.GrnMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.GrnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedGrnMaster = _mapper.Map<GrnMaster>(grnMasterRequest);
                updatedGrnMaster.GrnMasterId = grnMasterId; // Ensure the ID is not changed
                

                await _grnMasterService.UpdateGrnMaster(existingGrnMaster.GrnMasterId, updatedGrnMaster);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = grnMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.GrnMasterUpdated);
                return AddResponseMessage(Response, LogMessages.GrnMasterUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetGrnMastersByPurchaseOrderId/{purchaseOrderId}")]
        public async Task<ApiResponseModel> GetGrnMastersByPurchaseOrderId(int purchaseOrderId)
        {
            try
            {
                var grnMasters = await _grnMasterService.GetGrnMastersByPurchaseOrderId(purchaseOrderId);
                if (grnMasters != null)
                {
                    var grnMasterDtos = _mapper.Map<IEnumerable<GrnMasterDto>>(grnMasters);
                    AddResponseMessage(Response, LogMessages.GrnMastersRetrieved, grnMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.GrnMastersNotFound);
                    AddResponseMessage(Response, LogMessages.GrnMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
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
