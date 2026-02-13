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

                // send response
                var grnMasterDto = _mapper.Map<GrnMasterDto>(grnMaster);
                _logger.LogInformation(LogMessages.GrnMasterCreated);
                AddResponseMessage(Response, LogMessages.GrnMasterCreated, grnMasterDto, true, HttpStatusCode.Created);
            }
            catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex, "UK_SalesPerson_SalesPersonCode") ||
                                       IsUniqueConstraintViolation(ex, "IX_GrnMaster_CustDekNo_Unique"))
            {
                _logger.LogWarning(ex, "Attempt to create duplicate CustDekNo: {CustDekNo}", grnMasterRequest.CustDekNo);
                AddResponseMessage(Response, "CustDekNo already exists. Please use a unique value.", null, false, HttpStatusCode.Conflict);
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
                updatedGrnMaster.GrnReferenceNo = existingGrnMaster.GrnReferenceNo; // Preserve the existing GrnReferenceNo
                

                await _grnMasterService.UpdateGrnMaster(existingGrnMaster.GrnMasterId, updatedGrnMaster);

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

        [HttpGet("GetGrnMastersByWarehouseLocationId/{warehouseLocationId}")]
        public async Task<ApiResponseModel> GetGrnMastersByWarehouseLocationId(int warehouseLocationId)
        {
            try
            {
                var grnMasters = await _grnMasterService.GetGrnMastersByWarehouseLocationId(warehouseLocationId);
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


        private bool IsUniqueConstraintViolation(DbUpdateException ex, string constraintName)
        {
            // SQL Server error number for unique violation is 2601 or 2627
            return ex.InnerException is SqlException sqlEx &&
                   (sqlEx.Number == 2601 || sqlEx.Number == 2627) &&
                   sqlEx.Message.Contains(constraintName);
        }

    }
}
