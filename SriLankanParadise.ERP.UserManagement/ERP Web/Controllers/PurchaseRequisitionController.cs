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
    [Route("api/purchaseRequisition")]
    public class PurchaseRequisitionController :BaseApiController
    {
        private readonly IPurchaseRequisitionService _purchaseRequisitionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<PurchaseRequisitionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PurchaseRequisitionController(
            IPurchaseRequisitionService purchaseRequisitionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<PurchaseRequisitionController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _purchaseRequisitionService = purchaseRequisitionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddPurchaseRequisition(PurchaseRequisitionRequestModel purchaseRequisitionRequest)
        {
            try
            {
                var purchaseRequisition = _mapper.Map<PurchaseRequisition>(purchaseRequisitionRequest);
                await _purchaseRequisitionService.AddPurchaseRequisition(purchaseRequisition);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = purchaseRequisitionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var purchaseRequisitionDto = _mapper.Map<PurchaseRequisitionDto>(purchaseRequisition);
                _logger.LogInformation(LogMessages.PurchaseRequisitionCreated);
                AddResponseMessage(Response, LogMessages.PurchaseRequisitionCreated, purchaseRequisitionDto, true, HttpStatusCode.Created);
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
                var purchaseRequisitions = await _purchaseRequisitionService.GetAll();
                var purchaseRequisitionDtos = _mapper.Map<IEnumerable<PurchaseRequisitionDto>>(purchaseRequisitions);
                AddResponseMessage(Response, LogMessages.PurchaseRequisitionsRetrieved, purchaseRequisitionDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetPurchaseRequisitionsWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetPurchaseRequisitionsWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var purchaseRequisitions = await _purchaseRequisitionService.GetPurchaseRequisitionsWithoutDraftsByCompanyId(companyId);
                if (purchaseRequisitions != null)
                {
                    var purchaseRequisitionDtos = _mapper.Map<IEnumerable<PurchaseRequisitionDto>>(purchaseRequisitions);
                    AddResponseMessage(Response, LogMessages.PurchaseRequisitionsRetrieved, purchaseRequisitionDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionsNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseRequisitionsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{purchaseRequisitionId}")]
        public async Task<ApiResponseModel> GetPurchaseRequisitionByPurchaseRequisitionId(int purchaseRequisitionId)
        {
            try
            {
                var purchaseRequisition = await _purchaseRequisitionService.GetPurchaseRequisitionByPurchaseRequisitionId(purchaseRequisitionId);
                if (purchaseRequisition != null)
                {
                    var purchaseRequisitionDto = _mapper.Map<PurchaseRequisitionDto>(purchaseRequisition);
                    AddResponseMessage(Response, LogMessages.PurchaseRequisitionRetrieved, purchaseRequisitionDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseRequisitionNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("approve/{purchaseRequisitionId}")]
        public async Task<ApiResponseModel> ApprovePurchaseRequisition(int purchaseRequisitionId, ApprovePurchaseRequisitionRequestModel approvePurchaseRequisitionRequest)
        {
            try
            {
                var existingPurchaseRequisition = await _purchaseRequisitionService.GetPurchaseRequisitionByPurchaseRequisitionId(purchaseRequisitionId);
                if (existingPurchaseRequisition == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseRequisitionNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approvedPurchaseRequisition = _mapper.Map<PurchaseRequisition>(approvePurchaseRequisitionRequest);
                approvedPurchaseRequisition.PurchaseRequisitionId = purchaseRequisitionId; // Ensure the ID is not changed

                await _purchaseRequisitionService.ApprovePurchaseRequisition(existingPurchaseRequisition.PurchaseRequisitionId, approvedPurchaseRequisition);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = approvePurchaseRequisitionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                //_logger.LogInformation(LogMessages.PurchaseRequisitionApproved);
                return AddResponseMessage(Response, LogMessages.PurchaseRequisitionApproved, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetPurchaseRequisitionsByUserId/{userId}")]
        public async Task<ApiResponseModel> GetPurchaseRequisitionsByUserId(int userId)
        {
            try
            {
                var purchaseRequisitions = await _purchaseRequisitionService.GetPurchaseRequisitionsByUserId(userId);
                if (purchaseRequisitions != null)
                {
                    var purchaseRequisitionDtos = _mapper.Map<IEnumerable<PurchaseRequisitionDto>>(purchaseRequisitions);
                    AddResponseMessage(Response, LogMessages.PurchaseRequisitionsRetrieved, purchaseRequisitionDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionsNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseRequisitionsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{purchaseRequisitionId}")]
        public async Task<ApiResponseModel> UpdatePurchaseRequisition(int purchaseRequisitionId, PurchaseRequisitionRequestModel purchaseRequisitionRequest)
        {
            try
            {
                var existingPurchaseRequisition = await _purchaseRequisitionService.GetPurchaseRequisitionByPurchaseRequisitionId(purchaseRequisitionId);
                if (existingPurchaseRequisition == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseRequisitionNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedPurchaseRequisition = _mapper.Map<PurchaseRequisition>(purchaseRequisitionRequest);
                updatedPurchaseRequisition.PurchaseRequisitionId = purchaseRequisitionId;
                updatedPurchaseRequisition.ReferenceNo = existingPurchaseRequisition.ReferenceNo;

                await _purchaseRequisitionService.UpdatePurchaseRequisition(existingPurchaseRequisition.PurchaseRequisitionId, updatedPurchaseRequisition);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = purchaseRequisitionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.PurchaseRequisitionUpdated);
                return AddResponseMessage(Response, LogMessages.PurchaseRequisitionUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{purchaseRequisitionId}")]
        public async Task<ApiResponseModel> DeletePurchaseOrder(int purchaseRequisitionId)
        {
            try
            {
                var existingPurchaseRequisition = await _purchaseRequisitionService.GetPurchaseRequisitionByPurchaseRequisitionId(purchaseRequisitionId);
                if (existingPurchaseRequisition == null)
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionNotFound);
                    return AddResponseMessage(Response, LogMessages.PurchaseRequisitionNotFound, null, true, HttpStatusCode.NotFound);
                }
                await _purchaseRequisitionService.DeletePurchaseOrder(existingPurchaseRequisition.PurchaseRequisitionId);
                _logger.LogInformation(LogMessages.PurchaseRequisitionDeleted);
                return AddResponseMessage(Response, LogMessages.PurchaseRequisitionDeleted, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
        [HttpGet("GetPaginatedPurchaseRequisitionsWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetPaginatedPurchaseRequisitionsWithoutDraftsByCompanyId(
            int companyId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _purchaseRequisitionService.GetPaginatedPurchaseRequisitionsWithoutDraftsByCompanyId(companyId, pageNumber, pageSize);

                if (result.Items.Any())
                {
                    var purchaseRequisitionDtos = _mapper.Map<IEnumerable<PurchaseRequisitionDto>>(result.Items);

                    var responseData = new
                    {
                        Data = purchaseRequisitionDtos,
                        Pagination = new
                        {
                            result.TotalCount,
                            result.PageNumber,
                            result.PageSize,
                            result.TotalPages,
                            result.HasPreviousPage,
                            result.HasNextPage
                        }
                    };

                    AddResponseMessage(Response, LogMessages.PurchaseRequisitionsRetrieved, responseData, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PurchaseRequisitionsNotFound);
                    AddResponseMessage(Response, LogMessages.PurchaseRequisitionsNotFound, null, true, HttpStatusCode.OK);
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
