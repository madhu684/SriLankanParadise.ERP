using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.ComponentModel.Design;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/supplyReturnMaster")]
    public class SupplyReturnMasterController : BaseApiController
    {
        private readonly ISupplyReturnMasterService _supplyReturnMasterService;
        private readonly ILogger<SupplyReturnMasterController> _logger;
        private readonly IMapper _mapper;

        public SupplyReturnMasterController(ISupplyReturnMasterService supplyReturnMasterService, ILogger<SupplyReturnMasterController> logger, IMapper mapper)
        {
            _supplyReturnMasterService = supplyReturnMasterService;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSupplyReturnMaster(SupplyReturnMasterRequestModel supplyReturnMasterRequestModel)
        {
            try
            {
                var supplyReturnMaster = _mapper.Map<SupplyReturnMaster>(supplyReturnMasterRequestModel);
                await _supplyReturnMasterService.AddSupplyReturnMaster(supplyReturnMaster);

                var masterDto = _mapper.Map<SupplyReturnMasterDto>(supplyReturnMaster);
                _logger.LogInformation(LogMessages.SupplyReturnDetailCreated);
                AddResponseMessage(Response, LogMessages.SupplyReturnDetailCreated, masterDto, true, HttpStatusCode.Created);
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
                var supplyReturnMaster = await _supplyReturnMasterService.GetAll();
                var supplyReturnMasterDtos = _mapper.Map<IEnumerable<SupplyReturnMasterDto>>(supplyReturnMaster);
                AddResponseMessage(Response, LogMessages.SupplyReturnMasterRetrieved, supplyReturnMasterDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex) {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetSupplyReturnMasterByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetSupplyReturnMasterByCompanyId(int companyId)
        {
            try
            {
                var supplyReturnMaster = await _supplyReturnMasterService.GetSupplyReturnMasterByCompanyId(companyId);
                if (supplyReturnMaster != null) 
                {
                    var supplyReturnMasterDtos = _mapper.Map<IEnumerable<SupplyReturnMasterDto>>(supplyReturnMaster);
                    AddResponseMessage(Response, LogMessages.SupplyReturnMasterRetrieved, supplyReturnMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SupplyReturnMasterNotFound);
                    AddResponseMessage(Response, LogMessages.SupplyReturnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetSupplyReturnMasterByUserId/{userId}")]
        public async Task<ApiResponseModel> GetSupplyReturnMasterByUserId (int userId)
        {
            try
            {
                var supplyReturnMaster = await _supplyReturnMasterService.GetSupplyReturnMasterByUserId(userId);
                if (supplyReturnMaster != null)
                {
                    var supplyReturnMasterDtos = _mapper.Map<IEnumerable<SupplyReturnMasterDto>>(supplyReturnMaster);
                    AddResponseMessage(Response, LogMessages.SupplyReturnMasterRetrieved, supplyReturnMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SupplyReturnMasterNotFound);
                    AddResponseMessage(Response, LogMessages.SupplyReturnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetSupplyReturnMasterBySupplyReturnMasterId/{supplyReturnMasterId}")]
        public async Task<ApiResponseModel> GetSupplyReturnMasterBySupplyReturnMasterId(int supplyReturnMasterId)
        {
            try
            {
                var supplyReturnMaster = await _supplyReturnMasterService.GetSupplyReturnMasterBySupplyReturnMasterId(supplyReturnMasterId);
                if (supplyReturnMaster != null)
                {
                    var supplyReturnMasterDtos = _mapper.Map<SupplyReturnMasterDto>(supplyReturnMaster);
                    AddResponseMessage(Response, LogMessages.SupplyReturnMasterRetrieved, supplyReturnMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SupplyReturnMasterNotFound);
                    AddResponseMessage(Response, LogMessages.SupplyReturnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("approve/{supplyReturnMasterId}")]
        public async Task<ApiResponseModel> ApproveSupplyReturnMaster(int supplyReturnMasterId, ApproveSupplyReturnMasterRequsetModel approveSupplyReturnMasterRequsetModel)
        {
            try
            {
                var existingSupplyReturnMaster = await _supplyReturnMasterService.GetSupplyReturnMasterBySupplyReturnMasterId(supplyReturnMasterId);
                if (existingSupplyReturnMaster == null) 
                {
                    _logger.LogWarning(LogMessages.SupplyReturnMasterNotFound);
                    AddResponseMessage(Response, LogMessages.SupplyReturnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approveSupplyReturnMaster = _mapper.Map<SupplyReturnMaster>(approveSupplyReturnMasterRequsetModel);
                approveSupplyReturnMaster.SupplyReturnMasterId = supplyReturnMasterId;

                await _supplyReturnMasterService.ApproveSupplyReturnMaster(existingSupplyReturnMaster.SupplyReturnMasterId, approveSupplyReturnMaster);
               
                _logger.LogInformation(LogMessages.SupplyReturnMasterApproved);
                AddResponseMessage(Response, LogMessages.SupplyReturnMasterApproved, null, true, HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{supplyReturnMasterId}")]
        public async Task<ApiResponseModel> UpdateSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMasterRequestModel supplyReturnMasterRequestModel)
        {
            try
            {
                var existingSupplyReturnMaster = await _supplyReturnMasterService.GetSupplyReturnMasterBySupplyReturnMasterId(supplyReturnMasterId);
                if (existingSupplyReturnMaster == null)
                {
                    _logger.LogWarning(LogMessages.SupplyReturnMasterNotFound);
                    AddResponseMessage(Response, LogMessages.SupplyReturnMasterNotFound, null, true, HttpStatusCode.NotFound);
                }
                 
                var updatedSupplyReturnMaster = _mapper.Map<SupplyReturnMaster>(supplyReturnMasterRequestModel);
                updatedSupplyReturnMaster.SupplyReturnMasterId = supplyReturnMasterId;

                await _supplyReturnMasterService.UpdateSupplyReturnMaster(updatedSupplyReturnMaster.SupplyReturnMasterId, updatedSupplyReturnMaster);

                _logger.LogInformation(LogMessages.SupplyReturnMasterUpdated);
                AddResponseMessage(Response, LogMessages.SupplyReturnMasterUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex) {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }
    }
}
