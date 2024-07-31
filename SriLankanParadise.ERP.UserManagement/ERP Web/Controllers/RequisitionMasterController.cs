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
    [Route("api/requisitionMaster")]
    public class RequisitionMasterController : BaseApiController
    {
        private readonly IRequisitionMasterService _requisitionMasterService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<RequisitionMasterController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RequisitionMasterController(
            IRequisitionMasterService requisitionMasterService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<RequisitionMasterController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _requisitionMasterService = requisitionMasterService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddRequisitionMaster(RequisitionMasterRequestModel requisitionMasterRequest)
        {
            try
            {
                var requisitionMaster = _mapper.Map<RequisitionMaster>(requisitionMasterRequest);
                await _requisitionMasterService.AddRequisitionMaster(requisitionMaster);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = requisitionMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var requisitionMasterDto = _mapper.Map<RequisitionMasterDto>(requisitionMaster);
                _logger.LogInformation(LogMessages.RequisitionMasterCreated);
                AddResponseMessage(Response, LogMessages.RequisitionMasterCreated, requisitionMasterDto, true, HttpStatusCode.Created);
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
                var requisitionMasters = await _requisitionMasterService.GetAll();
                var requisitionMasterDtos = _mapper.Map<IEnumerable<RequisitionMasterDto>>(requisitionMasters);
                AddResponseMessage(Response, LogMessages.RequisitionMastersRetrieved, requisitionMasterDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetRequisitionMastersWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetRequisitionMastersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var requisitionMasters = await _requisitionMasterService.GetRequisitionMastersWithoutDraftsByCompanyId(companyId);
                if (requisitionMasters != null)
                {
                    var requisitionMasterDtos = _mapper.Map<IEnumerable<RequisitionMasterDto>>(requisitionMasters);
                    AddResponseMessage(Response, LogMessages.RequisitionMastersRetrieved, requisitionMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.RequisitionMastersNotFound);
                    AddResponseMessage(Response, LogMessages.RequisitionMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        
        [HttpPatch("approve/{requisitionMasterId}")]
        public async Task<ApiResponseModel> ApproveRequisitionMaster(int requisitionMasterId, ApproveRequisitionMasterRequestModel approveRequisitionMasterRequest)
        {
            try
            {
                var existingRequisitionMaster = await _requisitionMasterService.GetRequisitionMasterByRequisitionMasterId(requisitionMasterId);
                if (existingRequisitionMaster == null)
                {
                    _logger.LogWarning(LogMessages.RequisitionMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.RequisitionMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approvedRequisitionMaster = _mapper.Map<RequisitionMaster>(approveRequisitionMasterRequest);
                approvedRequisitionMaster.RequisitionMasterId = requisitionMasterId; // Ensure the ID is not changed

                await _requisitionMasterService.ApproveRequisitionMaster(existingRequisitionMaster.RequisitionMasterId, approvedRequisitionMaster);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = approveRequisitionMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.RequisitionMasterApproved);
                return AddResponseMessage(Response, LogMessages.RequisitionMasterApproved, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetRequisitionMastersByUserId/{userId}")]
        public async Task<ApiResponseModel> GetRequisitionMastersByUserId(int userId)
        {
            try
            {
                var requisitionMasters = await _requisitionMasterService.GetRequisitionMastersByUserId(userId);
                if (requisitionMasters != null)
                {
                    var requisitionMasterDtos = _mapper.Map<IEnumerable<RequisitionMasterDto>>(requisitionMasters);
                    AddResponseMessage(Response, LogMessages.RequisitionMastersRetrieved, requisitionMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.RequisitionMastersNotFound);
                    AddResponseMessage(Response, LogMessages.RequisitionMastersNotFound, null, true, HttpStatusCode.NotFound);
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
