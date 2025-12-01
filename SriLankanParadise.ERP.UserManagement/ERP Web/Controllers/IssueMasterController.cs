using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/issueMaster")]
    public class IssueMasterController : BaseApiController

    {
        private readonly IIssueMasterService _issueMasterService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<IssueMasterController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IssueMasterController(
            IIssueMasterService issueMasterService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<IssueMasterController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _issueMasterService = issueMasterService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddIssueMaster(IssueMasterRequestModel issueMasterRequest)
        {
            try
            {
                var issueMaster = _mapper.Map<IssueMaster>(issueMasterRequest);
                await _issueMasterService.AddIssueMaster(issueMaster);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = issueMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var issueMasterDto = _mapper.Map<IssueMasterDto>(issueMaster);
                _logger.LogInformation(LogMessages.IssueMasterCreated);
                AddResponseMessage(Response, LogMessages.IssueMasterCreated, issueMasterDto, true, HttpStatusCode.Created);
            }
            catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex, "UK_IssueMaster_IssuingCustDekNo") ||
                                       IsUniqueConstraintViolation(ex, "IX_IssueMaster_IssuingCustDekNo_Unique"))
            {
                _logger.LogWarning(ex, "Attempt to create duplicate IssuingCustDekNo: {IssuingCustDekNo}", issueMasterRequest.IssuingCustDekNo);
                AddResponseMessage(Response, "IssuingCustDekNo already exists. Please use a unique value.", null, false, HttpStatusCode.Conflict);
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
                var issueMasters = await _issueMasterService.GetAll();
                var issueMasterDtos = _mapper.Map<IEnumerable<IssueMasterDto>>(issueMasters);
                AddResponseMessage(Response, LogMessages.IssueMastersRetrieved, issueMasterDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetIssueMastersWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetIssueMastersWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var issueMasters = await _issueMasterService.GetIssueMastersWithoutDraftsByCompanyId(companyId);
                if (issueMasters != null)
                {
                    var issueMasterDtos = _mapper.Map<IEnumerable<IssueMasterDto>>(issueMasters);
                    AddResponseMessage(Response, LogMessages.IssueMastersRetrieved, issueMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.IssueMastersNotFound);
                    AddResponseMessage(Response, LogMessages.IssueMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPatch("approve/{issueMasterId}")]
        public async Task<ApiResponseModel> ApproveIssueMaster(int issueMasterId, ApproveIssueMasterRequestModel approveIssueMasterRequest)
        {
            try
            {
                var existingIssueMaster = await _issueMasterService.GetIssueMasterByIssueMasterId(issueMasterId);
                if (existingIssueMaster == null)
                {
                    _logger.LogWarning(LogMessages.IssueMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.IssueMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approvedIssueMaster = _mapper.Map<IssueMaster>(approveIssueMasterRequest);
                approvedIssueMaster.IssueMasterId = issueMasterId; // Ensure the ID is not changed

                await _issueMasterService.ApproveIssueMaster(existingIssueMaster.IssueMasterId, approvedIssueMaster);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = approveIssueMasterRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.IssueMasterApproved);
                return AddResponseMessage(Response, LogMessages.IssueMasterApproved, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetIssueMastersByUserId/{userId}")]
        public async Task<ApiResponseModel> GetIssueMastersByUserId(int userId)
        {
            try
            {
                var issueMasters = await _issueMasterService.GetIssueMastersByUserId(userId);
                if (issueMasters != null)
                {
                    var issueMasterDtos = _mapper.Map<IEnumerable<IssueMasterDto>>(issueMasters);
                    AddResponseMessage(Response, LogMessages.IssueMastersRetrieved, issueMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.IssueMastersNotFound);
                    AddResponseMessage(Response, LogMessages.IssueMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetIssueMastersByRequisitionMasterId/{requisitionMasterId}")]
        public async Task<ApiResponseModel> GetIssueMastersByRequisitionMasterId(int requisitionMasterId)
        {
            try
            {
                var issueMasters = await _issueMasterService.GetIssueMastersByRequisitionMasterId(requisitionMasterId);
                if (issueMasters != null)
                {
                    var issueMasterDtos = _mapper.Map<IEnumerable<IssueMasterDto>>(issueMasters);
                    AddResponseMessage(Response, LogMessages.IssueMastersRetrieved, issueMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.IssueMastersNotFound);
                    AddResponseMessage(Response, LogMessages.IssueMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }        
        
        [HttpGet("getIssueMastersById/{id}")]
        public async Task<ApiResponseModel> GetIssueMastersById(int id)
        {
            try
            {
                var issueMasters = await _issueMasterService.GetIssueMastersById(id);
                if (issueMasters != null)
                {
                    var issueMasterDtos = _mapper.Map<IEnumerable<IssueMasterDto>>(issueMasters);
                    AddResponseMessage(Response, LogMessages.IssueMastersRetrieved, issueMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.IssueMastersNotFound);
                    AddResponseMessage(Response, LogMessages.IssueMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpDelete("{id}")]
        public async Task<ApiResponseModel> DeleteIssueMasterAndDetail(int id)
        {
            try
            {
                var existingIssueMaster = await _issueMasterService.GetIssueMasterByIssueMasterId(id);
                if(existingIssueMaster == null)
                {
                    _logger.LogWarning(LogMessages.IssueMastersNotFound);
                    return AddResponseMessage(Response, LogMessages.IssueMastersNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _issueMasterService.DeleteIssueMasterAndDetailById(id);

                _logger.LogInformation(LogMessages.IssueMasterDeleted);
                return AddResponseMessage(Response, LogMessages.IssueMasterDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        // Helper method
        private bool IsUniqueConstraintViolation(DbUpdateException ex, string constraintName)
        {
            // SQL Server error number for unique violation is 2601 or 2627
            return ex.InnerException is SqlException sqlEx &&
                   (sqlEx.Number == 2601 || sqlEx.Number == 2627) &&
                   sqlEx.Message.Contains(constraintName);
        }
    }
}
