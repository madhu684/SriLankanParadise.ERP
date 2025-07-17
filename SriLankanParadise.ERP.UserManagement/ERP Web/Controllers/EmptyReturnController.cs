using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
    [Route("api/emptyReturn")]
    public class EmptyReturnController : BaseApiController
    {
        private readonly IEmptyReturnService _emptyReturnService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<LocationInventoryController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public EmptyReturnController(
            IEmptyReturnService emptyReturnService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<LocationInventoryController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _emptyReturnService = emptyReturnService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("addEmptyReturn")]
        public async Task<ApiResponseModel> AddEmptyReturn([FromBody] AddEmptyReturnRequestModel request)
        {
            try
            {
                var result = await _emptyReturnService.AddEmptyReturnAsync(request);

                _logger.LogInformation(LogMessages.EmptyReturnCreated);
                AddResponseMessage(Response, LogMessages.EmptyReturnCreated, result, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetEmptyReturnDetails/{companyId}")]
        public async Task<ApiResponseModel> GetEmptyReturnDetails(int companyId)
        {
            try
            {
                var result = await _emptyReturnService.GetEmptyReturnsAsync(companyId);

                if (result != null && result.Any())
                {
                    var dtoList = _mapper.Map<IEnumerable<EmptyReturnMasterDto>>(result);
                    AddResponseMessage(Response, "Empty return details retrieved successfully", dtoList, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning("Empty return details not found for CompanyId: {companyId}", companyId);
                    AddResponseMessage(Response, "Empty return details not found", null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve empty return details");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        //[HttpPut("update/{emptyReturnMasterId}")]
        //public async Task<ApiResponseModel> UpdateEmptyReturnDetailss(int emptyReturnMasterId, UpdateEmptyReturnRequestModel requestModel)
        //{
        //    try
        //    {
        //        var existingMaster = await _emptyReturnService.GetEmptyReturnMasterById(emptyReturnMasterId);
        //        if (existingMaster == null)
        //        {
        //            _logger.LogWarning(LogMessages.EmptyReturnMasterNotFound);
        //            return AddResponseMessage(Response, LogMessages.EmptyReturnMasterNotFound, null, true, HttpStatusCode.NotFound);
        //        }

        //        // Map request data except ReferenceNo
        //        var updatedMaster = _mapper.Map<EmptyReturnMaster>(requestModel);
        //        updatedMaster.EmptyReturnMasterId = emptyReturnMasterId;

        //        await _emptyReturnService.UpdateEmptyReturnMasterAndDetails(updatedMaster);

        //        _logger.LogInformation(LogMessages.EmptyReturnMasterUpdated);
        //        return AddResponseMessage(Response, LogMessages.EmptyReturnMasterUpdated, null, true, HttpStatusCode.OK);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, ErrorMessages.InternalServerError);
        //        return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
        //    }
        //}


        [HttpPatch("update/{emptyReturnMasterId}")]
        public async Task<ApiResponseModel> UpdateEmptyReturnDetails(int emptyReturnMasterId, UpdateEmptyReturnRequestModel requestModel)
        {
            try
            {
                var existingMaster = await _emptyReturnService.GetEmptyReturnMasterById(emptyReturnMasterId);
                if (existingMaster == null)
                {
                    _logger.LogWarning(LogMessages.EmptyReturnMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.EmptyReturnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _emptyReturnService.UpdateEmptyReturnMasterAndDetails(emptyReturnMasterId, requestModel);

                _logger.LogInformation(LogMessages.EmptyReturnMasterUpdated);
                return AddResponseMessage(Response, LogMessages.EmptyReturnMasterUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPatch("approve/{emptyReturnMasterId}")]
        public async Task<ApiResponseModel> ApproveEmptyReturnMaster(int emptyReturnMasterId, [FromBody] ApproveEmptyReturnRequestModel request)
        {
            try
            {
                var success = await _emptyReturnService.ApproveEmptyReturnMaster(emptyReturnMasterId, request);
                if (!success)
                {
                    return AddResponseMessage(Response, "EmptyReturnMaster not found", null, true, HttpStatusCode.NotFound);
                }

                return AddResponseMessage(Response, "EmptyReturnMaster approved successfully", null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }


    }
}
